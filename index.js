var mysql = require("mysql");
var inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "greatbay"
});

connection.connect(err => {
    if (err) throw err;



})

function loginPrompt() {
    
}