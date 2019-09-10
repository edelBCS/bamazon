require("dotenv").config();

var dbAuth = require("./dbAuth.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require("clear");
var colors = require("colors");



var connection = mysql.createConnection(dbAuth.mysqlAuth);

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
        console.log(colors.bgWhite.blue.bold.underline("  MAIN MENU  "));
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
            message: "Enter the No. of the item you would like to purchase" + colors.gray(" (Enter[q] to quit): ")
        }
    ]).then(ans1 => {
        if(ans1.whatToBuy === "q" || ans1.whatToBuy === "Q")
            process.exit(1);
        else if (isNaN(parseInt(ans1.whatToBuy))){
            clear();
            console.log(colors.bold.bgYellow.red("\n\n************************\nInvalid Selection/Entry!\n************************\n"));
            main();
        }else{
            inquirer.prompt([
                {
                    name: "howMany",
                    type: "input",
                    message: "How many unit would do you want to buy? "
                }
            ]).then(ans2 => {
                if (isNaN(parseInt(ans2.howMany))){
                    clear();
                    console.log(colors.bold.bgYellow.red("\n\n************************\nInvalid Selection/Entry!\n************************\n"));
                    main();
                }else{
                    makePurchase(ans1.whatToBuy, ans2.howMany);
                }
            });
        }
    });
}

function makePurchase(itemNo, itemQuantity){
    connection.query(`SELECT stock_quantity, product_name, product_sales, price FROM products WHERE item_id = '${itemNo}'`, (err, resp) => {
        if(err) throw err;

        var currentStock = resp[0].stock_quantity;
        var productName = resp[0].product_name;
        var productSales = resp[0].product_sales;
        var productCost = resp[0].price;

        if(itemQuantity > currentStock){
            clear();
            console.log(colors.bold.red("\nInsufficent Stock Available!!!\n"));
            main();
        }else{
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: currentStock - itemQuantity,
                    product_sales: productSales + (productCost * itemQuantity)
                },
                {
                    item_id: itemNo
                }
            ],(err, res) => {
                if (err) throw err;
                clear();
                console.log(colors.bold.green(`\nYou have just purchased (${itemQuantity}) x ${productName}\n`));
                console.log(colors.bold.yellow(`${res.affectedRows} product(s) has been updated!`))
                main();
            });
        }
    });
}