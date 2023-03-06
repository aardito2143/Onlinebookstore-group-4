const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const database = require('../database/database');

// Create a hash of the user's password to store
const createPasswordHash = async(password) => {
    // Gerate salt for the password
    const salt = crypto.randomBytes(16).toString('hex');
    // Hash the password with the salt
    const hash = crypto.createHmac('sha256', salt)
                        .update(password)
                        .digest('hex')
    // Return the salt and the hashed password for storage
    return { salt: salt, hash: hash };
}

const verifyHash = async (salt, pass) => {
    const hash = crypto.createHmac('sha256', salt)
                        .update(pass)
                        .digest('hex');

    return hash;
}

const createUser = async (email, password) => {
    try {
        console.log("Attempting to add new User to the database...");
        // Pass the User's password to be hashed
        const userHash = await createPasswordHash(password);
        // Create a payload to send to the database containing user data
        const payload = {
            email: email,
            salt: userHash.salt,
            hash: userHash.hash,
            role: 'user'
        };
        // Make call to database to insert a new document containing user details
        const response = await database.createEntry('users', payload);
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
            const userHash = await verifyHash(user.salt, pass);
            // If the hashes don't match the wrong password was entered
            if (userHash !== user.hash) {
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
                console.log("Successfully signed-in user and created their JSONWebTokens!");
                // Return both tokens and the User's role to the main API file
                return { message: "Login Successful", role: user.role, accessToken: accessToken, refreshToken: refreshToken };
            }
        }
    } catch (err) {
        console.log(err);
        return false;
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
    handleRefreshToken
}