require("dotenv").config();

var dbAuth = require("./dbAuth.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require("clear");
var colors = require("colors");

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
    inquirer.prompt([
        {
            name: "managerMenu",
            type: "list",
            message: "Select Option: ",
            choices: ["View Product for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(resp => {
        switch(resp.managerMenu){
            case "View Product for Sale":
                displayAllProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addStock();
                break;
            case "Add New Product":
                break;
            case "Quit":
                process.exit(1);
                break;
            default:
                console.log("Invalid Selection!")
        }
    });
}

function displayAllProducts(noMain){
    connection.query("SELECT * FROM products", (err, resp) => {
        if(err) throw err;
        clear();
        console.log(colors.bgWhite.blue.bold.underline("\n  List of ALL Available Products  "));
        resp.forEach(element => {
            console.log(`${element.item_id}) ${element.product_name} - $${element.price}`);
        });

        console.log("\n");
        main();
    });
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", (err, resp) => {
        if(err) throw err;
        clear();
        console.log(colors.red.bold("\nLow Inventory Items:"));
        resp.forEach(element => {
            console.log(`${element.item_id}) ${element.product_name} - Stock Amt: ${element.stock_quantity}`)
        });
        console.log("\n");
        main();
    });
}

function addStock(){
    inquirer.prompt([
        {
            name: "prod_id",
            type: "input",
            message: "Enter ID of product to restock (Enter 'M' for Main Menu): "
        }
    ]).then(resp1 => {
        if (resp1.prod_id === "M" || resp1.prod_id === "m"){
            main();
        }else if (isNaN(parseInt(resp1.prod_id))){
            console.log(colors.red.bold("Invalid ID!"));
            addStock();
        }else{
            inquirer.prompt([
                {
                    name: "unitsToAdd",
                    type: "input",
                    message: "# of Units to ADD to Stock: "
                }
            ]).then(resp2 => {
                connection.query(
                    `UPDATE products SET stock_quantity = stock_quantity + ${resp2.unitsToAdd} WHERE item_id = '${resp1.prod_id}'`,
                    (err, data) => {
                        if (err) throw err;
                        console.log(data.affectedRows + " products updated!\n");
                        main();
                    }
                );
            });
        }
    });
}

