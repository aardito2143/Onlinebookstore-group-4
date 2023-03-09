const database = require('../database/database');

const createBook = async (data) => {
    const { 
        title, 
        author, 
        genre, 
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
            price: price
        }

        const response = await database.createEntry('books', payload);
        if (response) {
            console.log("Successfully created a new book entry in database!");
            return true;
        } else {
            console.log("Failed to create new book entry.");
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    createBook
}