const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  recepients : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "Client"
  }],
  lastMessage : String,
  chats : [{
      content : String,
      sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Client"
      },
      date : {type : Date, default : Date.now}
  }]
}
);
module.exports = mongoose.model("Chat", chatSchema);



// var TestSchema = new mongoose.Schema({
//     name: String,
//     createdAt: { type: Date, expires: '2m', default: Date.now }
//   });