const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const users = require("./users/users");
const books = require("./books/books");
const stripe = require("./stripe/stripe");
const cart = require("./cart/cart");
const cookieParser = require("cookie-parser");
const PORT = 3001;
const app = express();

const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

const corsOptions = {
  origin: "https://ec2-54-175-236-193.compute-1.amazonaws.com",
  credentials: true,
};

// Tell the app to use the JSON parser from the express library
// this is needed to read the JSON sent in HTTP requests
app.use(express.json());
// Same thing but for cookies
app.use(cookieParser());
app.use(cors(corsOptions));

// Endpoint for creating a user
app.post("/api/users/create", async (req, res) => {
  // try/catch block attempts to create the user and logs out any errors
  try {
    // Asynchronous call to the users file, the email from the HTTP request
    // body parameter and pass are given as arguments
    const response = await users.createUser(
      req.body["email"],
      req.body["pass"]
    );

    // Coming back to this block of code if the call to users.createUser was true
    // we send an HTTP Response code of 200 which means (OK) or in other words, that
    // the request was successful. If that call returned false we respond with the code
    // 400 or (Bad Request). These codes are technically just semantic so really using the
    // correct one just benefits you or your front-end dev if you are only doing the backend.
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
app.post("/api/authentication", async (req, res) => {
  try {
    // Use Object destructuring to store email and pass from request body
    /*
            Object are typically represented like this:
            {
                email: 'example@example.com',
                pass: 'password1234'
            }

            Object destructuring allows you to pull the values ('example@example.com', 'password1234')
            from their keys ('email', pass') by using the curly braces and using the key names
            
            This isn't required as you can reference the value of a key like this:
            `req.body['email']`
            But that's a little clunky in my opinion but you'll see me go back and forth between them throughout
            this code. I really just did whatever I felt like typing out at the time.
        */
    const { email, pass } = req.body;
    // Pass user login details to sign in function in users file
    const response = await users.signInUser(email, pass);
    if (!response) {
      res.status(400).json({
        message: "Provided Login credentials are incorrect or don't exist.",
      });
    } else {
      // Send the refresh token back to the front-end as an http-only cookie. This is more secure than localStorage
      res.cookie("jwt", response.refreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });
      // Send the accessToken and user role back to the front end as an HTTP 200 code
      res.status(200).json({
        message: "Successfully signed in the user!",
        role: response.role,
        accessToken: response.accessToken,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("No Cookies Provided");
    return res.status(401).json("No Token Provided");
  }

  const refreshToken = cookies.jwt;

  try {
    const logoutResponse = await users.signOutUser(refreshToken);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res
      .status(200)
      .json({ message: "Successfully signed out the User!" });
  } catch (err) {
    console.log(err);
  }
});

// This is the products endpoint for creating a new product in the database
app.post("/api/products", async (req, res) => {
  try {
    // Call the createBook function from the books script
    const response = await books.createBook(req.body);
    // If no response return a 400 error as the book creation failed
    if (!response) {
      res.status(400).json({ message: "Failed to add book to the database." });
    } else {
      console.log(response);
      // Once the book has been added to the database it needs to be added to stripe as well
      const stripeResponse = await stripe.testCreateProduct(
        req.body,
        response.insertedId.toString()
      );
      if (!stripeResponse) {
        return res
          .status(400)
          .json({ message: "Failed to add product to stripe" });
      } else {
        // Time to update the book in the database with the now freshly created stripe product info
        const updateResponse = await books.updateBook(
          response.insertedId,
          stripeResponse.productId
        );
        if (updateResponse) {
          return res.status(200).json({
            message: "Successfully added the book to the database!",
            productId: stripeResponse.productId,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Failed to add stripe price ID to database" });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// This is how an accessToken is refreshed using the refresh token
app.get("/api/token/refresh", async (req, res) => {
  console.log("User is requesting a new access token...");
  // Store the cookies sent via the get request from the front-end
  const cookies = req.cookies;
  // If the cookie doesn't exist the refreshToken was not sent and the request should be rejected.
  if (!cookies.jwt)
    return res.status(401).json({ message: "No refresh token provided." });

  // Store the refreshToken
  const refreshToken = cookies.jwt;

  // Run a function to refresh the token
  const tokenResponse = await users.handleRefreshToken(refreshToken);
  if (tokenResponse) {
    console.log("Sending access token back to front-end!");

    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Access-Control-Allow-Origin",
        "https://ec2-54-175-236-193.compute-1.amazonaws.com"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    return res.status(200).json({
      role: tokenResponse.role,
      accessToken: tokenResponse.accessToken,
    });
  }
});

// This is a HTTP get request endpoint to get all of the books
app.get("/api/books", async (req, res) => {
  console.log("Hit books endpoint for list of books!");
  try {
    // Calls get books, this one is slightly different than the usual read entry
    // So head over to books.js to see this one in action
    const response = await books.getBooks();
    if (!response) {
      res.status(400).json({ message: "No books found!" });
    } else {
      if (process.env.NODE_ENV === "production") {
        res.setHeader(
          "Access-Control-Allow-Origin",
          "https://ec2-54-175-236-193.compute-1.amazonaws.com"
        );
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }
      res
        .status(200)
        .json({ message: "Successfully retrieved books!", data: response });
    }
  } catch (err) {
    console.log(err);
  }
});

// This is the same thing but now with a wildcard parameter
// What that means is this endpoint will be hit no matter
// what follows /api/books/ we use this to get specific
// book catergories. In our app this is pretty meaningless
// as there are not a lot of books anyway, but if you had
// thousands of books it is way more efficient to only
// grab the handful of the category you need rather than
// grabbing everything and filtering them.
app.get("/api/books/:category", async (req, res) => {
  console.log("Getting specific list of books");
  let category = req.params.category;
  // This bit is done because I named the category 'best seller' in the
  // database rather than best-sellers which is more URL friendly
  // it was easier to just convert it than to change all of the
  // categories in the database
  if (category.toLowerCase() === "best-sellers") category = "best seller";
  try {
    const response = await books.getBooks({ category: category });
    if (!response) {
      return res
        .status(400)
        .json({ message: "No books in that category found!" });
    } else {
      if (process.env.NODE_ENV === "production") {
        res.setHeader(
          "Access-Control-Allow-Origin",
          "https://ec2-54-175-236-193.compute-1.amazonaws.com"
        );
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }
      res
        .status(200)
        .json({ message: "Successfully retrieved books!", data: response });
    }
  } catch (err) {
    console.log(err);
  }
});

// This is the endpoint to get the contents of the cart from the DB
// At this point you should see the pattern and how you can apply
// this same flow to literally everything on your website
app.get("/api/cart", async (req, res) => {
  console.log("Getting Cart items...");
  const response = await cart.getCartItems();
  if (response) {
    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Access-Control-Allow-Origin",
        "https://ec2-54-175-236-193.compute-1.amazonaws.com"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    return res.status(200).json(response);
  } else {
    return res.status(400).json({ message: "Cart is empty" });
  }
});

// Adding an item to the cart
app.post("/api/cart", async (req, res) => {
  console.log("Adding a new item to the cart...");
  console.log(req.body["item"]);
  try {
    const response = await cart.addItemToCart(req.body["item"]);
    if (!response) {
      return res.status(400).json({ message: "Failed to add item to cart" });
    } else {
      res
        .status(200)
        .json({ message: "Successfully added a new item to the cart!" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Updating an item in the cart using its id in the wildcard parameter
app.put("/api/cart/:id", async (req, res) => {
  console.log("Attempting to update cart database...");
  console.log(req.body);
  const id = req.params.id;
  if (!req.body["set"]) {
    console.log("Not a set action, increment quantity by 1...");
    const updateResponse = await cart.incrementQuantity(id);
    if (updateResponse) {
      return res
        .status(200)
        .json({ message: "Successfully updated the quanity of cart item!" });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to update cart quantity" });
    }
  } else {
    console.log(
      "This is a set action, set the quantity to the provided number..."
    );
    const setUpdateResponse = await cart.updateQuantity(
      id,
      req.body["quantity"]
    );
    if (setUpdateResponse) {
      return res
        .status(200)
        .json({ message: "Successfully set item quantity to specified value" });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to update cart quantity" });
    }
  }
});

// There is no wildcard here so this endpoint is for clearing the cart completely
// clearCart does a little more so you can check that out if you are curious
app.delete("/api/cart", async (req, res) => {
  console.log("Clearing the cart...");
  try {
    const response = await cart.clearCart();
    if (response) {
      return res
        .status(200)
        .json({ message: "Successfully cleared the cart!" });
    } else {
      return res.status(400).json({ message: "Failed to clear the cart" });
    }
  } catch (err) {
    console.log(err);
  }
});

// This endpoint removes a specific cart item from the cart
app.delete("/api/cart/:id", async (req, res) => {
  console.log("Attempting to remove an item from the cart...");
  const id = req.params.id;
  try {
    const response = await cart.deleteItem(id);
    if (response) {
      return res
        .status(200)
        .json({ message: "Successfully removed the item from the cart!" });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to remove item from cart" });
    }
  } catch (err) {
    console.log(err);
  }
});

/*
    This is how the backend gets started. The PORT variable defines what port it will listen for connections on
    Due to Cross Origin Resource Sharing (CORS) rules in modern web browsers you technically shouldn't make
    any requests to a different location than what your website is hosted on. BUT you may say isn't the frontend
    on PORT 3000? And the answer is Yes! However, if you look at the package.json file you will see a 'proxy' value
    set to localhost:3001. This means any requests on the frontend ARE sent on the same port (3000) BUT they are
    proxied to go to 3001 tricking the browser and not triggering CORS protections. This same method can be applied
    on your internal network if for example your company has the front-end and backend hosted on two different servers

    In more extreme cases you can even do this over the public internet as well though that's usually frowned upon
    without using a company VPN between the devices.
*/

if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.log("Launched the backend in development mode!");
    console.log(`Server listening on ${PORT}...`);
  });
} else if (process.env.NODE_ENV === "production") {
  //   app.listen(PORT, () => {
  //     console.log("Launched the backend in production mode!");
  //     console.log(`Server listening on ${PORT}...`);
  //   });
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server listening on port ${PORT}...`);
  });
} else {
  console.log(
    "No evironment specified. Please run the backend with either the development or production environment commands."
  );
}
