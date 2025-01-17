const { getUserByName } = require("../models/user-model")

const sessionMiddleware = async (req, res, next) => {
    const { name } = req.body
 try{
    const user = await getUserByName(name)
    if (!user) {
        return res.status(404).json({ message : "User not found"})
    }
    const {sessionId, sessionExpiry} = user;

    if (!sessionId || !sessionExpiry) {
        return res.status(401).json({ message: "Session ID or Expiry date is missing"})
    }

    const currentTime = new Date(); //here
    
    console.log("current time:",currentTime)
    // const expiryDate = new Date(sessionExpiry)
    // console.log("expiry", expiryDate) // convert expiry string to date object
    if (currentTime > sessionExpiry) {
        return res.status(401).json({ message: "Session has expired" });
    }
       // If everything is fine, pass sessionId and sessionExpiry to the next middleware or controller
       req.sessionId = sessionId;
       req.sessionExpiry = sessionExpiry;
       next(); // Proceed to the next middleware or controller

    
 } catch(error) {
    console.log(error)
 }
}
module.exports = sessionMiddleware