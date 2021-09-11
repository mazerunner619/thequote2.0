const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username : String,
  bio : String,
  password : String,
  profilePicture  :{
    imageID : String,
    imageURL : String
  },
  posts : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Post"
}], 
  friends : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client"
  }],
  //received requests
  sentRequests : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Request"
  }],
  receivedRequests : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Request"
  }],
  notifications : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Notification"
  }],
}
,
{timestamps : true}  //.createdAt, .updatedAt
);


module.exports = mongoose.model("Client", userSchema);
