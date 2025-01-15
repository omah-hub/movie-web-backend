const { createUser, getUserByName, getUserByEmail } = require('../models/user-model')
const bcrypt = require("bcrypt");

module.exports = {
    async register(req, res, next) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All field must be filled" })
        }

        try {
            const user = await getUserByEmail(email);
            if (user) {
            return res.status(400).json({ error: "Email is already registered" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const userId = await createUser({
            name,
            email,
            password: hashedPassword,
        });

        // req.session.userId = userId;

        res.status(201).json({ message: "User created successfully", userId })
    } catch (error) {
        console.error(error)
        
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

        req.session.userId = user._id

        res.status(200).json({
            message: "login Successful",
            name: user.name,
            sessionId: req.session.id,
        });
    } catch (error) {
        console.error("Error logging user", error);
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