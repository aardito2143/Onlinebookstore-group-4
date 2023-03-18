const express = require('express');
const users = require('./users/users');
const books = require('./books/books');
const stripe = require('./stripe/stripe');
const cart = require('./cart/cart');
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
            res.cookie('jwt', response.refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true });
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
            console.log(response)

            const stripeResponse = await stripe.testCreateProduct(req.body, response.insertedId.toString());
            if(!stripeResponse){
                return res.status(400).json({ message: "Failed to add product to stripe" });
            } else {
                const updateResponse = await books.updateBook(response.insertedId, stripeResponse.productId);
                if (updateResponse) {
                    return res.status(200).json({ message: "Successfully added the book to the database!", productId: stripeResponse.productId })
                } else {
                    return res.status(400).json({ message: "Failed to add stripe price ID to database" });
                }
            }
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

app.get('/api/books', async (req, res) => {
    console.log("Hit books endpoint for list of books!");
    try {
        const response = await books.getBooks();
        if(!response) {
            res.status(400).json({ message: 'No books found!' });
        } else {
            res.status(200).json({ message: "Successfully retrieved books!", data: response });
        }
    } catch (err) {
        console.log(err);
    }
});

app.get('/api/cart', async (req, res) => {
    console.log("Getting Cart items...");
    const response = await cart.getCartItems();
    if (response) {
        return res.status(200).json(response);
    } else {
        return res.status(400).json({ message: 'Cart is empty' });
    }
});

app.post('/api/cart', async (req, res) => {
    console.log("Adding a new item to the cart...");
    console.log(req.body['item']);
    try {
        const response = await cart.addItemToCart(req.body['item']);
        if (!response) {
            return res.status(400).json({ message: "Failed to add item to cart" });
        } else {
            res.status(200).json({ message: "Successfully added a new item to the cart!" });
        }
    } catch (err) {
        console.log(err);
    }
});

app.put('/api/cart/:id', async (req, res) => {
    console.log("Attempting to update cart database...");
    console.log(req.body);
    const id = req.params.id;
    if (!req.body['set']) {
        console.log("Not a set action, increment quantity by 1...");
        const updateResponse = await cart.incrementQuantity(id);
        if (updateResponse) {
            return res.status(200).json({ message: "Successfully updated the quanity of cart item!" });
        } else {
            return res.status(400).json({ message: "Failed to update cart quantity" });
        }
    } else {
        console.log("This is a set action, set the quantity to the provided number...");
        const setUpdateResponse = await cart.updateQuantity(id, req.body['quantity']);
        if (setUpdateResponse) {
            return res.status(200).json({ message: "Successfully set item quantity to specified value" });
        } else {
            return res.status(400).json({ message: "Failed to update cart quantity" });
        }
    }
});

app.delete('/api/cart', async (req, res) => {
    console.log("Clearing the cart...");
    try {
        const response = await cart.clearCart();
        if (response) {
            return res.status(200).json({ message: "Successfully cleared the cart!" });
        } else {
            return res.status(400).json({ message: "Failed to clear the cart" });
        }
    } catch (err) {
        console.log(err);
    }
});

app.delete('/api/cart/:id', async (req, res) => {
    console.log("Attempting to remove an item from the cart...");
    const id = req.params.id;
    try {
        const response = await cart.deleteItem(id);
        if (response) {
            return res.status(200).json({ message: "Successfully removed the item from the cart!" });
        } else {
            return res.status(400).json({ message: "Failed to remove item from cart" });
        }
    } catch (err) {
        console.log(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
});