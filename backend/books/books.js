const database = require('../database/database');

// Creates a book, you get the idea from the users/ database one
const createBook = async (data) => {
    const { 
        title, 
        author, 
        genre,
        category,
        desc, 
        price 
    } = data;

    try {
        console.log("Attempting to add new Book to the database...");

        const payload = {
            title: title,
            author: author,
            genre: genre,
            desc: desc,
            price: price,
            stripe_id: '',
            category: category,
            avail_inventory: 5
        }

        const response = await database.createEntry('books', payload);
        if (response) {
            console.log("Successfully created a new book entry in database!");
            return response;
        } else {
            console.log("Failed to create new book entry.");
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

// Updates the book, these start to become really
// self-explanatory as you go through this pipeline
const updateBook = async(book, data) => {
    console.log("Updating book with new data...");
    console.log(book, data);
    const query = {
        _id: book
    }
    try {
        const updateResponse = await database.updateEntry('books', query, 'set', data, 'stripe_id');
        if (updateResponse) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

// This is used to decrement the books available inventory by the amount
// passed in the qty arguement. In the future this could be updated for increasing the
// qty and attaching the 'restocking' feature we never got around to, to it.
const updateBookInventory = async (book, qty) => {
    console.log("Updating inventory of book...");
    console.log(book);
    const query = {
        title: book
    }

    try {
        const updateResponse = await database.updateEntry('books', query, 'inc', qty * -1, 'avail_inventory');
        return updateResponse;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// Rather than a regular readEntry this one uses readEntryArray
// The difference is rather than getting back an individual object
// you get back an array of objects => [{},{},{}]
const getBooks = async (query={}, sort={ title: 1 }) => {
    const books = database.readEntryArray('books', query, sort);
    if (books) {
        console.log("Successfully retrieved books!");
        return books;
    } else {
        console.log("Failed to retrieve books");
        return false;
    }
}

module.exports = {
    createBook,
    updateBook,
    updateBookInventory,
    getBooks
}