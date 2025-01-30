require('dotenv').config();
const express = require('express')
const { run, dbConfig } = require('./src/database/connection')
const api = require('./src/routes/user-route')
const reactionRoutes = require('./src/routes/reaction-route');
const CommentRoutes = require('./src/routes/comment-route');
const TabRoutes = require('./src/routes/tab-route')

const session = require("express-session");
const cors = require('cors');
const bodyParser = require('body-parser')



const app = express()
let db;


async function initializeDatabase() {
    try {
        db = await run(); // Assign the returned `db` instance to the variable
        if (!db) {
            throw new Error("Database connection failed");
        }
        console.log("Database connection successful");
    } catch (error) {
        console.error("Error initializing database:", error);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1); // Only exit in non-test environments
        }
        throw error; // Rethrow the error for test environments
    }
}


app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (!db) {
        return res.status(500).json({ error: 'Database connection not available' });
    }
    req.db = db;
    next();
});

(async () => {
    await initializeDatabase()
    app.use(
        session({
          secret: "your-secret-key", // Secret key to sign the session ID cookie
          resave: false, // Don't save session if it's not modified
          saveUninitialized: false, // Don't create a session until something is stored
        //   cookie: { secure: false, maxAge: 3600000 }, // 1 hour session expiry
        })
    );
    
    app.use('/api', api);
    app.use('/api', reactionRoutes);
    app.use('/api', CommentRoutes);
    app.use('/api', TabRoutes)

    
    app.listen(port, () => {
        console.log(`App is running on port ${dbConfig.port}`)
    })

})();


module.exports = app;