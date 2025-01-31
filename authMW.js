// a MW to check for Logged in user
const jwt = require("jsonwebtoken");

module.exports = async function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("auth MW ", verified);
    if (verified) {
      req.user = { _id: verified.userId };
      next();
    } else {
      res.status(401).send("UNAUTHORIZED !");
    }
  } else {
    res.status(401).send("UNAUTHORIZED !");
  }
};
