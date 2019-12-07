var connection = require("./db");

/**
 * Constructor for a new Item
 * @param {object} values 
 */
function Item(values) {
    this.id = values.id || null;
    this.name = values.name || "";
    this.highBid = values.highBid || 0;
    this.highestBidderId = values.highestBidderId || null;
}

/**
 * Insert new item into DB
 * @param {object} values 
 */
function create(values) {
    connection.query(
        "INSERT INTO item SET ?",
        values,
        (error, result) => {
            //do nothing?
        }
    )
}

//Doesn't work right -- async issues...
// function read(id) {
//     connection.query(
//         "SELECT * FROM item WHERE ?",
//         { id: id },
//         (error, result) => {
//             return new Item(result[0]);
//         }
//     )
// }

/**
 * Update item with specified id
 * @param {number} id 
 * @param {object} values 
 */
function update(id, values) {
    connection.query(
        "UPDATE item SET ? WHERE ?",
        [values, { id: id }],
        (error, result) => {
            //do nothing?
        }
    )
}

/**
 * Delete specified object
 * @param {number} id 
 */
function deleteItem(id) {
    connection.query(
        "DELETE FROM item WHERE ?",
        { id: id },
        (error, result) => {
            //do nothing?
        }
    )
}

module.exports = {
    Item: Item,
    create: create,
    update: update,
    delete: deleteItem
}