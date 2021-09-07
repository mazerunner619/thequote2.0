const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment : String,
  commentBy : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Client"
  },
  commentTo : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client"
  }
}
,
{timestamps : true}
);
module.exports = mongoose.model("Comment", commentSchema);

