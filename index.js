var inquirer = require("inquirer");
var Item = require("./Item");
var connection = require("./db");

const POST = "Post an item";
const BID = "Bid on an item";

//Prompt user if they would like to post an item, or bid on an item
//--Starting Point--
function promptAction() {
    inquirer.prompt([
        {
            type: "list",
            choices: [POST, BID],
            message: "What would you like to do?",
            name: "choice"
        }
    ]).then(answer => {
        switch (answer.choice) {
            case POST:
                promptCreateItem();
                break;
            case BID:
                promptBidOnItem();
                break;
        }
    });
}

//Prompts for posting a new item for sale
function promptCreateItem() {
    console.log("-------------------");
    console.log("|  Post New Item  |");
    console.log("-------------------");
    inquirer.prompt([
        {
            message: "Name: ",
            name: "name"
        }
    ]).then(values => {
        Item.create(values);
        promptAction();
    })
}

//Prompts for bidding on an item. Shows all items, asks user which one to bid on, and for a bid.
//If user entered bid is highest, display message and update item in DB
function promptBidOnItem() {
    console.log("--------------------");
    console.log("|  Bid On An Item  |");
    console.log("--------------------");

    let items = [];
    let itemChoices = [];

    connection.query(
        "SELECT * FROM item",
        (error, result) => {
            console.log(result);
            result.forEach(item => {
                items.push(new Item.Item(item)); //There must be a better way, to avoid "Item.Item()"
                itemChoices.push(item.id);
            });

            showAvailableItems(items);

            inquirer.prompt([
                {
                    type: "list",
                    choices: itemChoices,
                    message: "Choose an item: ",
                    name: "id"
                },
                {
                    message: "Enter a new bid: ",
                    name: "bid"
                }
            ]).then(choice => {
                // console.log(choice.id);
                // console.log(parseFloat(choice.bid));
            })
        }
    )
}

//Helper function to display results when listing all available items
function showAvailableItems(items) {
    console.log("-------------- Available Items --------------");
    items.forEach(item => {
        console.log(`${item.id}. ${item.name} (${item.highBid})`);
    });
}

//Execute starting point
promptAction();