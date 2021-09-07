const mongoose = require("mongoose");

const reqSchema = new mongoose.Schema({
  from : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Client"
  },
  to : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client"
  },
  accepted : {type : Boolean, default : false}
}
,
{timestamps : true}
);
module.exports = mongoose.model("Request", reqSchema);

