const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://ctuteama:ctuteama@cluster0.h4bah9x.mongodb.net/test';
const client = new MongoClient(uri);

const connectToDatabase = async () => {
    console.log("Creating connection to MongoDB Database...");
    try {
        const database = client.db('capstoneproject');

        return database;
    } catch (err) {
        console.log(err);
    }
}

const createEntry = async (table, payload) => {
    console.log("Attempting to create new entry in the database...");
    let objectId = '';
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);

        const response = await coll.insertOne(payload);
        objectId = response.insertedId;
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

const readEntry = async (table, query) => {
    console.log("Attempting to find an entry in the database matching the provided query...");
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);

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

const updateEntry = async (table, query, action="set", payload, location="") => {
    console.log("Attempting to update entry in database...");
    try {
        const conn = await connectToDatabase();
        const coll = await conn.collection(table);

        const item = await coll.findOne(query);
        if (!item){
            console.log("No items found matching the provided query");
            return false;
        } else {
            try {
                switch (action) {
                    case "set":
                        const setResponse = await coll.updateOne(query, { $set: { [location]: payload } });
                        if (setResponse) {
                            console.log("Successfully updated the targeted entry with new data");
                            return true;
                        }
                        break;
                    case "inc":
                        const incResponse = await coll.updateOne(query, { $inc: { quantity: payload } });
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