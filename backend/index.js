const express = require('express');
const users = require('./users/users');
const PORT = 3001;
const app = express();

app.use(express.json());

app.post('/api/users/create', async (req, res) => {
    try {
        const response = await users.createUser(req.body['email'], req.body['pass']);
        if (response) {
            res.status(200).json({ message: "Registration successful!" });
            return;
        } else {
            res.status(400).json({ message: "User Registration Failed." });
            return;
        }
    } catch (err) {
        console.log(err);
    }
});


// Authentication endpoint for signing a user on
app.post('/api/authentication', async (req, res) => {
    try {
        // Use Object destructuring to store email and pass from request body
        const { email, pass } = req.body;
        // Pass user login details to sign in function in users file
        const response = await users.signInUser(email, pass);
        if (!response) {
            res.status(400).json({ message: "Provided Login credentials are incorrect or don't exist." });
        } else {
            res.status(200).json({ message: "Successfully signed in the user!", token: response.token });
        }
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
});