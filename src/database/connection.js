const { MongoClient } = require('mongodb');
const { comment } = require('postcss');
// const url = 'mongodb://localhost:27017/mydb'

require('dotenv').config();

let dbConfig;



if (process.env.NODE_ENV === 'test') {
 dbConfig = {
  databaseUrl : process.env.DATABASE_URL_TEST,
  port : process.env.PORT_TEST,
  dbName : process.env.DB_NAME_TEST,
  collectionName : process.env.COLLECTION_NAME_TEST,
  reactionCollection : process.env.REACTION_COLLECTION_TEST,
  commentCollection : process.env.COMMENT_COLLECTION_TEST,
 }


  
} else {
  dbConfig = {
    databaseUrl : process.env.DATABASE_URL_PROD,
    port : process.env.PORT_PROD,
    dbName : process.env.DB_NAME_PROD,
    collectionName : process.env.COLLECTION_NAME,
    reactionCollection : process.env.REACTION_COLLECTION_PROD,
    commentCollection : process.env.COMMENT_COLLECTION_PROD

  }

}

const url = dbConfig.databaseUrl

const client = new MongoClient(url);

async function run() {
    try {
        await client.connect()
        const db = client.db(dbConfig.dbName)
        // console.log("Connected to database:", db.databaseName)
        return {db, client };
    } catch (error) {
        console.log("An error occured", error)
    }
}

module.exports = { run, dbConfig };