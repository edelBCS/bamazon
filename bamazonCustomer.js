require("dotenv").config();

var dbAuth = require("./dbAuth.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require("clear");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: dbAuth.mysqlAuth.user,
    password: dbAuth.mysqlAuth.password,
    database: "bamazon"
});

connection.connect(err => {
    if(err) throw err;
    console.log(`connected as ID ${connection.threadId}`);
    clear();
    main();
});

function main(){
    displayAllProducts();
}

function displayAllProducts(){
    connection.query("SELECT * FROM products", (err, resp) => {
        if(err) throw err;
        resp.forEach(element => {
            console.log(`${element.item_id}) ${element.product_name} - $${element.price}`);
        });

        console.log("\n");
    
        promptCust();
    });
    
}

function promptCust(){
    inquirer.prompt([
        {
            name: "whatToBuy",
            type: "input",
            message: "Enter the No. of the item you would like to purchage: "
        },
        {
            name: "howMany",
            type: "input",
            message: "Enter purchase quantity: "
        }
    ]).then(resp => {
        if (isNaN(parseInt(resp.whatToBuy)) || isNaN(parseInt(resp.howMany))){
            clear();
            console.log("\n\n************************\nInvalid Selection/Entry!\n************************\n");
            main();
        }else{
            makePurchase(resp.whatToBuy, resp.howMany);
        }
    });
}

function makePurchase(itemNo, itemQuantity){
    connection.query(`SELECT stock_quantity, product_name FROM products WHERE item_id = '${itemNo}'`, (err, resp) => {
        if(err) throw err;

        var currentStock = resp[0].stock_quantity;
        var productName = resp[0].product_name;

        if(itemQuantity > currentStock){
            clear();
            console.log("\nInsufficent Stock Available!!!\n");
            main();
        }else{
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: currentStock - itemQuantity
                },
                {
                    item_id: itemNo
                }
            ],(err, resp) => {
                if (err) throw err;
                clear();
                console.log(`\nYou have just purchased (${itemQuantity}) x ${productName}\n`);
                main();
            });
        }
    });
}