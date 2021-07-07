const mongoose = require("mongoose");

const quoteSchema = {
  username : String,
  password : String,
}

const User = mongoose.model("User", quoteSchema);
module.exports = User;
