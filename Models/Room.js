const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  admin : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client"
  },

  roomname : String,
  members : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "Client"
  }],
  messages : [{
      content : String,
      sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Client"
    }
  }]
}
,
{timestamps : true}
);
module.exports = mongoose.model("Room", roomSchema);



// var TestSchema = new mongoose.Schema({
//     name: String,
//     createdAt: { type: Date, expires: '2m', default: Date.now }
//   });