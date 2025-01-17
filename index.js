require('dotenv').config();
const express = require('express')
const { run } = require('./src/database/connection')
const api = require('./src/routes/user-route')
const session = require("express-session");
const cors = require('cors');
const bodyParser = require('body-parser')



const app = express()
// const port = port

// let db;


let  port, dbName, db;

if (process.env.NODE_ENV === 'test') {
  databaseUrl = process.env.DATABASE_URL_TEST;
  port = process.env.PORT_TEST;
  dbName = process.env.DB_NAME_TEST;
} else {
  databaseUrl = process.env.DATABASE_URL_PROD;
  port = process.env.PORT_PROD;
  dbName = process.env.DB_NAME_PROD;
}


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
    
    app.use('/api', api)
    
    app.listen(port, () => {
        console.log(`App is running on port ${port}`)
    })

})();


module.exports = app;