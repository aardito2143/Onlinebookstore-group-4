const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://ctuteama:ctuteama@cluster0.h4bah9x.mongodb.net/test';
const client = new MongoClient(uri);

/* This database uses a pretty basic implementation of CRUD operations
    C - Create
    R - Read
    U - Update
    D - Delete
    Technically, this isn't the verbage that MongoDB uses but I tried to
    only refer to them with the common verbs to make it easier to understand.
    These same verbs apply to all kinds of databases and data manipulation as 
    a whole.
*/


// Function for creating the connection to the database
// in the past, connections needed to be closed once an
// operation was done, but MongoDB will close them for you now
const connectToDatabase = async () => {
    console.log("Creating connection to MongoDB Database...");
    try {
        // Connect to the database named 'capstoneproject'
        const database = client.db('capstoneproject');

        // return the connection
        return database;
    } catch (err) {
        console.log(err);
    }
}


// Creating an entry will insert the data provided in the payload
// into the specified table (MongoDB calls these 'collections')
const createEntry = async (table, payload) => {
    console.log("Attempting to create new entry in the database...");
    try {
        // Get and store a connection
        const conn = await connectToDatabase();
        // Get a reference to the table (collection) you want to manipulate
        const coll = await conn.collection(table);

        // Store the response from the database after inserting the payload
        const response = await coll.insertOne(payload);
        
        // Here I am checking if there is a response at all, if there is
        // an error it will go to the catch block
        if (response) {
            console.log("Successfully created new database entry!");
            return response;
        } else {
            console.log("Failed to create new database entry.");
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}


// Read entry is basically taking search parameters and checking if anything can be
// found in the database matching those parameters. Querys are done as objects though:
// { <field>: <searchValue> } an example would be { user_email: 'example@example.com' }
// This would then search the database to see if any entry has example@example.com in their
// user_email property (field)
const readEntry = async (table, query) => {
    console.log("Attempting to find an entry in the database matching the provided query...");
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);

        // Stores the result of the search
        // The result comes back as an object
        const result = await coll.findOne(query);
        if (result) {
            console.log("Successfully found an entry that matches the provided query!");
            return result;
        } else {
            console.log("Failed to find an entry matching the provided query.");
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

// Takes the same query argument, this time there is a sort arguement
// This allows you to specify how you want the response to be ordered
// For example in our code I order the books alphabetically by title.
const readEntryArray = async (table, query, sort) => {
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);
        const queryResult = await coll.find(query).sort(sort).toArray();
        if (queryResult){
            return queryResult;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

/*
    Inside of updateEntry there is a lot going on. This started a lot simpler and 
    started getting more complex as we added new features. Ideally you build things
    so they scale up easily over time but sometimes you do what you gotta do with
    time constraints.

    The arguments here have default values, that means if you call the function
    and don't specify them they will instead use what has already been set here
*/
const updateEntry = async (table, query, action="set", payload, location="") => {
    console.log("Attempting to update entry in database...");
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);

        // Looks for an item matching the query so it can be updated
        const item = await coll.findOne(query);
        if (!item){
            console.log("No items found matching the provided query");
            return false;
        } else {
            try {
                // This is a switch statement, they are technically better than if/else if chaining
                // so it's preferred to use them instead when there are different conditions you want
                // to check
                switch (action) {
                    // There are different ways you can update a field in MongoDB
                    // this first case is a 'set' action where the value of the field
                    // will be overwritten with the payload
                    case "set":
                        const setResponse = await coll.updateOne(query, { $set: { [location]: payload } });
                        if (setResponse) {
                            console.log("Successfully updated the targeted entry with new data");
                            return true;
                        }
                        break;
                    // This is an increment operator we can use this to add or subtract from
                    // a field that stores a number i.e. the available inventory of our books
                    case "inc":
                        const incQuery = {};
                        incQuery[location] = payload;
                        const incResponse = await coll.updateOne(
                            query, 
                            { $inc: incQuery }
                        );
                        if (incResponse) {
                            console.log("Successfully updated the quantity of the target entry");
                            return true;
                        }
                        break;
                }
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }  
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteEntry = async (table, query) => {
    console.log("Attempting to delete entry from the database...");
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);

        const item = await coll.findOne(query);
        if (!item) {
            console.log("Failed to find an entry matching the provided query.");
            return false;
        } else {
            console.log("Successfully found entry that matches the provided query!");
            const response = await coll.deleteOne(query);
            if (response) {
                console.log("Successfully deleted the entry from the database!");
                return true;
            } else {
                console.log("Failed to delete entry from the database.");
                return false;
            }
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteAll = async (table, query={}) => {
    console.log("Attempting to remove all entries from specified collection...");
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);

        const deleteResponse = await coll.deleteMany(query);
        if (deleteResponse) {
            return deleteResponse
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    createEntry,
    readEntry,
    readEntryArray,
    updateEntry,
    deleteEntry,
    deleteAll
}