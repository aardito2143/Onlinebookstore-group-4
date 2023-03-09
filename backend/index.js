const express = require('express');
const users = require('./users/users');
const books = require('./books/books');
const cookieParser = require('cookie-parser');
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());

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
            // Send the refresh token back to the front-end as an http-only cookie. This is more secure than localStorage
            res.cookie('jwt', response.refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            // Send the accessToken and user role back to the front end as an HTTP 200 code
            res.status(200).json({ message: "Successfully signed in the user!", role: response.role, accessToken: response.accessToken });
        }
    } catch (err) {
        console.log(err);
    }
});

app.post('/api/products', async (req, res) => {
    try {
        // Call the createBook function from the books script
        const response = await books.createBook(req.body);
        // If no response return a 400 error as the book creation failed 
        if(!response) {
            res.status(400).json({ message: "Failed to add book to the database." });
        } else {
            // Send a 200 code on successful execution of the function
            res.status(200).json({ message: "Successfully added the book to the database!" })
        }
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/token/refresh', async (req, res) => {
    console.log("User is requesting a new access token...");
    // Store the cookies sent via the get request from the front-end
    const cookies = req.cookies;
    // If the cookie doesn't exist the refreshToken was not sent and the request should be rejected.
    if(!cookies.jwt) return res.status(401).json({ message: "No refresh token provided." });

    // Store the refreshToken
    const refreshToken = cookies.jwt;

    // Run a function to refresh the token
    const tokenResponse = await users.handleRefreshToken(refreshToken);
    if (tokenResponse) {
        console.log('Sending access token back to front-end!');
        return res.status(200).json({ role: tokenResponse.role, accessToken: tokenResponse.accessToken });
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
});