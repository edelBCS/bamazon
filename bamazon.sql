DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price DEC(10, 2) NOT NULL,
    stock_quantity INT(10),
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
("Nvidia RTX 2080", "Computers", 999.99, 10),
("LG 80in OLED TV", "Electonics", 2999.99, 5),
("Nespresso Vertio", "Home Goods", 119.99, 20),
("15in Macbook Pro", "Computers", 1999.99, 15),
("MTG Booster Box", "Toys & Games", 99.99, 100),
("Settlers of Catan", "Toys & Games", 49.99, 50),
("Dog Food", "Pet Supplies", 29.99, 150),
("Roomba RoboVac", "Home Goods", 299.99, 75),
("Popeyes Chicken Sandwich", "Food & Grocery", 1000.00, 0),
("Mystery Box", "Misc", 100.00, 1);