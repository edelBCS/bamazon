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
            choices: ["View Product for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete Product", "Quit"]
        }
    ]).then(resp => {
        switch(resp.managerMenu){
            case "View Product for Sale":
                clear();
                displayAllProducts(main);
                break;
            case "View Low Inventory":
                clear();
                lowInventory();
                break;
            case "Add to Inventory":
                clear();
                displayAllProducts(addStock);
                break;
            case "Add New Product":
                clear();
                console.log(colors.bold.underline.green("Adding a NEW Product\n"))
                addProduct();
                break;
            case "Delete Product":
                clear();
                displayAllProducts(deleteProduct);
                break;
            case "Quit":
                process.exit(1);
                break;
            default:
                console.log("Invalid Selection!")
        }
    });
}

function displayAllProducts(func){
    connection.query("SELECT * FROM products", (err, resp) => {
        if(err) throw err;
        console.log(colors.bgWhite.blue.bold.underline("\n  List of ALL Available Products  "));
        resp.forEach(element => {
            console.log(`${element.item_id}) ${element.product_name} - $${element.price}`);
        });

        console.log("\n");
        func();
    });
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", (err, resp) => {
        if(err) throw err;
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
                        clear();
                        console.log(colors.bold.yellow(data.affectedRows + " products updated!\n" + resp2.unitsToAdd + " unit(s) added to Product ID " + resp1.prod_id + "\n\n"));
                        main();
                    }
                );
            });
        }
    });
}

function addProduct(){    
    connection.query(`SELECT DISTINCT department_name FROM products`, (err, deptQry) => {
        if(err) throw err;

        var departments = []

        deptQry.forEach(element => {
            departments.push(element.department_name);
        });

        inquirer.prompt([
            {
                name: "prodName",
                type: "input",
                message: "What is the Product Name: "
            },
            {
                name: "deptName",
                type: "list",
                message: "What department does this product belong to?",
                choices: departments
            },
            {
                name: "stockLvl",
                type: "input",
                message: "How many units are being added to the inventory: ",
            },
            {
                name: "price",
                type: "input",
                message: "Enter the price of this product:"
            },
        ]).then(resp => {
            connection.query(
                `INSERT INTO products SET ?`,
                {
                    product_name: resp.prodName,
                    department_name: resp.deptName,
                    stock_quantity: resp.stockLvl,
                    price: resp.price
                },
                (err, res) => {
                    if(err) throw err;
                    console.log("\n" + res.affectedRows + " product inserted into inventory!\n");
                    main();
                }
            );
        });
    });   
}

function deleteProduct(){
    inquirer.prompt([
        {
            name: "del_item",
            type: "input",
            message: "Enter the ID NO of the product that you would like to DELETE: "
        }
    ]).then(resp => {
        if(isNaN(parseInt(resp.del_item))){
            clear();
            console.log(colors.bold.red("\nINVALID PRODUCT ID, Try Again!\n"))
            displayAllProducts(deleteProduct);
        }else{
            connection.query(
                `DELETE FROM products WHERE ?`,
                {
                    item_id: resp.del_item
                },
                (err, res) => {
                    if(err) throw err;

                    clear();
                    if(res.affectedRows === 0){
                        console.log(colors.bold.red("No item found with ID " + resp.del_item));
                    }
                    console.log(colors.bold.yellow(res.affectedRows + " products deleted!\n"));
                    main();
                }
            )
        }
    });    
}

