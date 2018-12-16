var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Uthman82",
    database: "bamazon_db"

})

connection.connect(function (err) {
    if (err) throw err;
    console.log("connection successful");
    makeTable();

})

var makeTable = function () {
    connection.query("SELECT  * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " || " + res[i].product_name + " || " +
                res[i].department_name + " || " + res[i].price + " || " + res[i].
                    stock_quantity + "\n");


        }
        promptCustomer(res);


    })

}

var promptCustomer = function (res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: "What do you wanna buy, playa? [Hit x to exit]"

    }]).then(function (answer) {
        var correct = false;
        
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name == answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: 'input',
                    name: 'quant',
                    message: "How many do you wanna buy, boss?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stock_quantity-answer.quant)>0){
                        connection.query("UPDATE products SET stock_quantity=' "+(res[id].stock_quantity-
                        answer.quant)+"' WHERE product_name='"+product
                        +"'", function(err,res2){
                            console.log("Product Bought!");
                            makeTable();
                        })


                    }else {
                        console.log("Make a valid selection");
                        promptCustomer(res);

                    }
                })
            }
        }
    })
}




                
