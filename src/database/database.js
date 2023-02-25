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

(async () => {
    const response = await connectToDatabase();
    console.log(response);
})();