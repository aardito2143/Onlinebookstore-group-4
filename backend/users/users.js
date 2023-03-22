const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database/database');

// Create a hash of the user's password to store
const createPasswordHash = async(password) => {
    // saltRounds is how many times the password is salted
    // diminishing returns on increasing it from 10
    const saltRounds = 10;
    
    // Create a hashed password using the bcrypt library
    // This is not usually an async function but I don't want
    // it to run syncronously so we use a Promise to wrap the
    // function instead
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            // if the function fails reject the promise
            if (err) reject(err);

            // if successful resolve the promise
            resolve(hash);
        });
    });

    // Return the hashed password, logging it to the console isn't
    // the best practice but it help with debugging in a dev environment
    console.log(`User password Hash: ${hashedPassword}`);
    return hashedPassword;
}

// This checks if the hash of the password the user entered into the
// login field matches the hash we have stored in the database for that
// user
const verifyHash = async (userHash, pass) => {
    const match = await bcrypt.compare(pass, userHash);

    return match;
}

// Function for creating the user
const createUser = async (email, password) => {
    try {
        console.log("Attempting to add new User to the database...");
        // Pass the User's password to be hashed
        const userHash = await createPasswordHash(password);
        // Create a payload to send to the database containing user data
        const payload = {
            email: email,
            hash: userHash,
            role: 'user',
            refresh_token: ''
        };
        // Make call to database to insert a new document containing user details
        const response = await database.createEntry('users', payload);

        // This checks the result of response up above. Before I would return
        // false if there were errors. We return true here if the database call
        // returned true as well.
        /*
            This can also be simplified as:

            `return response;`
            
            As `if (condition) return true;` is basically the same thing just more
            verbose. However, that doesn't allow you to log any messages and in
            my opinion is harder to read.
        */
        if (response) {
            console.log("Successfully created new user entry in database!");
            return true;
        } else {
            console.log("Failed to create new user entry.");
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}


// This is the sign in function. Here is where the user gets authenticated
const signInUser = async (email, pass) => {
    try {
        // Create a query to search for the provided email in the database
        const query = {
            email: email
        }
        // Use the database file to query the database and return the user object if found
        const user = await database.readEntry('users', query);
        // If no user was found return false
        if (!user) {
            console.log("A user with that e-mail does not exist...");
            return false;
        } else {
            // Verify the provided password hashed with the user's salt matches the hash stored in the database
            const userHash = await verifyHash(user.hash, pass);
            // If the hashes don't match the wrong password was entered
            if (!userHash) {
                console.log("Entered password is incorrect.");
                return false;
            } else {
                // If the password was correct, begin the sign in process
                console.log("Email and password are correct! Attempting to sign-in the user...");
                // JSON Web Tokens require a payload. The payload contains information about the user
                // The expiration is set to 30 days below
                const payload = {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                };
                // JWTs must be signed with a secret key; best practice would be to store the secret in a .env
                // Anyone with the secret key can decode the JWT and get the user information, re-encode it and user
                // it maliciously

                // We're going to generate an accessToken and a refreshToken. AccessTokens expire quickly to prevent a
                // bad actor from stealing your token and using it in your name. RefreshTokens are used to generate a
                // new accessToken after it expires
                const accessToken = jwt.sign(
                    payload,
                    'mysecretaccesskey',
                    {
                        expiresIn: '15m'
                    }
                )
                const refreshToken = jwt.sign(
                    payload,
                    'mysecretrefreshkey',
                    {
                        expiresIn: '30d'
                    }
                )

                // Now we update the user in the database to store their refresh token.
                // This isn't the most ideal implementation as signing in on another PC invalidates your
                // refresh token and makes you sign in again. Usually you also wouldn't make your
                // own sign in method as it's better to just use a library and let them manage the
                // security of tokens
                const tokenResponse = await database.updateEntry('users', query, 'set', refreshToken, 'refresh_token');
                if (tokenResponse) {
                    console.log('Successfully added refresh token to the database!');
                    console.log('Successfully signed in User!');
                    return { message: "Login Successful", role: user.role, accessToken: accessToken, refreshToken: refreshToken };
                } else {
                    console.log('Failed to add refresh token to database.');
                    return false;
                }
            }
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const signOutUser = async (refreshToken) => {
    console.log("Attempting to sign out user...");
    try {
        const decoded = await new Promise ((resolve, reject) => {
            jwt.verify(
                refreshToken,
                'mysecretrefreshkey',
                (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                }
            )
        });

        const userExists = await database.readEntry('users', { email: decoded.email });

        if(!userExists) {
            return;
        }

        const tokenResponse = await database.updateEntry('users',
            { email: decoded.email },
            'set', '', 'refresh_token');

        if(tokenResponse) {
            return;
        }
    } catch (err) {
        console.log(err);
        return;
    }
}

const handleRefreshToken = async (refreshToken) => {
    console.log("Attempting to refresh user's access token...");
    // Create refrences in the functions scope to access them after the internal function
    let accessToken = '';
    let role = '';

    // This is used to decode the JWT and get access to the data inside to sign a new
    // access token
    jwt.verify(
        refreshToken,
        'mysecretrefreshkey',
        (err, decoded) => {
            // If there's an error return a 403
            if (err) {
                return { status: 403 }
            }
            // Payload changes to use decoded as the base
            const payload = {
                id: decoded._id,
                email: decoded.email,
                role: decoded.role,
            };
            // Create new access token
            accessToken = jwt.sign(
                payload,
                'mysecretaccesskey',
                { expiresIn: '15m' }
            )
            // Success!
            console.log("User access token refreshed!");
            role = decoded.role;
        }
    )
    return { message: "Refreshed Access Token!", role: role, accessToken: accessToken };
}

module.exports = {
    createUser,
    signInUser,
    handleRefreshToken,
    signOutUser
}