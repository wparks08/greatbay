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
            result.forEach(item => {
                items.push(new Item.Item(item)); //There must be a better way, to avoid "Item.Item()"
                itemChoices.push(item.id);
            });

            itemChoices.push("Back");

            showAvailableItems(items);

            inquirer.prompt([
                {
                    type: "list",
                    choices: itemChoices,
                    message: "Choose an item: ",
                    name: "id"
                }
            ]).then(choice => {
                if (choice.id == "Back") {
                    promptAction();
                } else {
                    inquirer.prompt([
                        {
                            message: "Enter a new bid: ",
                            name: "bid"
                        }       
                    ]).then(answer => {
                        let selectedItem;
                        items.forEach(item => {
                            if (item.id == choice.id) {
                                selectedItem = item;
                            }
                        });

                        if (parseFloat(selectedItem.highBid) < parseFloat(answer.bid)) {
                            console.log("You are the new high bidder!");
                            Item.update(choice.id, { highBid: parseFloat(answer.bid) });
                        } else {
                            console.log("Bid not high enough.");
                        }
                        promptBidOnItem();
                    })
                    
                }
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