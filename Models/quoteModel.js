const mongoose = require("mongoose");

const quoteSchema = {
  author : String,
  quote : String,
}

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
