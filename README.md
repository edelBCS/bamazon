# BAMAZON
#### A CLI Amazon style app...sort of?!?
This Store contains a MySQL Database that contains Products and Store Departments. The Store is made up of 3 different apps:
* Customer App
* Manager App
* Supervisor App

## Installation
### Requirements
* MySQL
* MySQL Workbench(optional)
* Node.js

## Setup
1. Clone repo locally to your machine
2. Rename the sample.env -> .env
3. Edit the .env file and fill out relevant database info
4. Execute the contents of *bamazon.sql* in MySQL Workbench to create database
5. Execute the contents of *bamazon_seeds.sql* to create inital data in DB
6. Run `npm i` to install neccessary node packages
7. Run the bamazon*.js files to use the different parts of the app.

## Usage
### Customer App
When the customer app is run it will print a list of Product in from the database that are for sale. 

The user is prompted to enter the number of the item they want to purchase, then prompted to enter how many unit of that Product they would like to purchase.

If there is not enough stock to fullful the order, a message is displayed to the user

### Manager App
This app allows a store manager to:
* View Products for Sale
* View any Products that have low inventory
* Add more Inventory to existing Products
* Add a new Product
* Delete a product

### Supervisor App
