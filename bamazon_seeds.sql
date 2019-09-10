INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES
("Nvidia RTX 2080", "Computers", 999.99, 10, 0.00),
("LG 80in OLED TV", "Electronics", 2999.99, 5, 0.00),
("Nespresso Vertio", "Home Goods", 119.99, 20, 0.00),
("15in Macbook Pro", "Computers", 1999.99, 15, 0.00),
("MTG Booster Box", "Toys & Games", 99.99, 100, 0.00),
("Settlers of Catan", "Toys & Games", 49.99, 50, 0.00),
("Dog Food", "Pet Supplies", 29.99, 150, 0.00),
("Roomba RoboVac", "Home Goods", 299.99, 75, 0.00),
("Popeyes Chicken Sandwich", "Food & Grocery", 1000.00, 0, 0.00),
("Mystery Box", "Misc", 100.00, 1, 0.00);

SELECT * FROM products;

INSERT INTO departments (department_name, over_head_costs) VALUES
("Computers", 1000.00),
("Electronics", 2500.00),
("Home Goods", 500.00),
("Toys & Games", 200.00),
("Pet Supplies", 150.00),
("Food & Grocery", 3500.00),
("Misc", 5.00);

SELECT * FROM departments;