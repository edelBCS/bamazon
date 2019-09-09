DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price DEC(10, 2) NOT NULL,
    stock_quantity INT,
    product_sales DEC(10, 2) NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(20) NOT NULL,
    over_head_costs DEC(10, 2) NOT NULL,
    PRIMARY KEY (department_id)
);