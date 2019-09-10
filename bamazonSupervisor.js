require("dotenv").config();

var dbAuth = require("./dbAuth.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require("clear");
var colors = require("colors");
const {table} = require('table');

var connection = mysql.createConnection(dbAuth.mysqlAuth);

connection.connect(err => {
    if (err) throw err;
    console.log(`connected as ID ${connection.threadId}`);
    clear();
    main();
});

function main() {
    inquirer.prompt([{
        name: "supervisorMenu",
        type: "list",
        message: "Select Option: ",
        choices: ["View Product Sales by Department", "Create New Department", "Quit"]
    }]).then(resp => {
        switch (resp.supervisorMenu) {
            case "View Product Sales by Department":
                clear();
                salesByDept();
                break;
            case "Create New Department":
                clear();
                createDept();
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

function salesByDept() {
    var data = [["Dept. ID", "Dept. Name", "Total Sales", "Overhead", "Total_Profit"]];
    var deptQry = "SELECT departments.department_id, departments.department_name, SUM(products.product_sales) AS totalProduct_sales, departments.over_head_costs " +
                    "FROM products RIGHT JOIN departments " +
                    "ON products.department_name = departments.department_name " +
                    "GROUP BY department_name";
    connection.query(deptQry, (err, resp) => {
        if (err) throw err;

        resp.forEach(element => {
            var temp = [];
            temp.push(element.department_id);
            temp.push(element.department_name);
            temp.push(element.totalProduct_sales);
            temp.push(element.over_head_costs);
            temp.push(element.totalProduct_sales - element.over_head_costs);
            data.push(temp);
        });
        console.log(colors.bold.green("\nSales Data by Department"));
        console.log(table(data))
        main();
    });
    
}

function createDept() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the NEW department? "
        },
        {
            name: "cost",
            type: "input",
            message: "What are the overhead cost for new Dept.?"
        }
    ]).then(answers => {
        connection.query(
            `INSERT INTO departments SET ?`, {
                department_name: answers.name,
                over_head_costs: answers.cost
            },
            (err, res) => {
                if (err) throw err;
                console.log("Create " + res.affectedRows + "new Dept named: " + answers.name);
                main();
            }
        );
    });

}