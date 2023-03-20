const database = require('../database/database');

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

const getBooks = async () => {
    const query = {}
    const sort = { title: -1 };
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