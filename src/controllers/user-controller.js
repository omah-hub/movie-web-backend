const { createUser, getUserByName, updateSession, getUserByEmail } = require('../models/user-model')
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const session = require('express-session');

module.exports = {
    async register(req, res, next) {
        const { name, email, password } = req.body;
    
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields must be filled" });
        }
    
        try {
            // Check if the user already exists
            const user = await getUserByEmail(email);
            if (user) {
                return res.status(400).json({ error: "Email is already registered" });
            }
    
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create the user and generate a session ID
            const userData = await createUser({
                name,
                email,
                password: hashedPassword,
            });
    
            // Extract userId from createUser result
            const userId = userData.insertedId; // Assuming MongoDB returns the ID in this field
            const sessionId = crypto.randomBytes(16).toString('hex'); // Generate session ID
            const sessionExpiry = userData.sessionExpiry;
    
            // Save session data in the request (if using express-session)
            req.session.userId = userId;
            req.session.id = sessionId; // Attach the sessionId to the session
            req.session.sessionExpiry = sessionExpiry;
    
            // Respond with user information
            res.status(201).json({
                message: "User created successfully",
                userId,
                name,
                sessionId,
                sessionExpiry
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    

// login

async login(req, res, next) {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: "All fields are required"});
    }
    try {
        const user = await getUserByName(name);

        if (!user) {
            return res.status(400).json({ error: "Invalid username and password"})
            // console.log(error)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

     // Update session details
     const { sessionId, sessionExpiry } = await updateSession(name);

     // Store session data in the request object
     req.session.userId = user._id;
     req.session.id = sessionId;
     req.session.sessionExpiry = sessionExpiry;

     // Respond to the client
     res.status(200).json({
         message: "Login Successful",
         name: user.name,
         sessionId,
         sessionExpiry,
     });
    } catch (error) {
        console.error("Error logging user", error);
    }
},



async getUser(req, res, next) {
    const { name } = req.body
    // console.log(req.body);
    try {
       const response = await getUserByName(name)
       return res.json({
        status: 'successful',
        data: response
    })
    } catch (error) {
        console.log(error)
    }
},



async logout(req, res, next) {
    try {
       await req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }

        res.clearCookie('sessionId')
        res.status(200).json({ message: "Logged out successfully" })
       });
    } catch (error) {
        console.log(error)
    }
    }
    
    
}