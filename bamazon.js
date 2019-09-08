require("dotenv").config();

var dbAuth = require("./dbAuth.js");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Emar1956",
    database: "bamazon"
});

connection.connect(err => {
    if(err) throw err;
    console.log(`connected as ID ${connection.threadId}`);
});