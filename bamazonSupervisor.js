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
            name: "supervisorMenu",
            type: "list",
            message: "Select Option: ",
            choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
    ]).then(resp => {
        switch(resp.managerMenu){
            case "View Product Sales by Department":
                clear();
                
                break;
            case "Create New Department":
                clear();
                
                break;
            case "Quit":
                process.exit(1);
                break;
            default:
                console.log("Invalid Selection!")
                main();
        }
    });
}