const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username : String,
  bio : String,
  password : String,
  active : {type : Boolean, default : false},
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
  notifications : {

    notification : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Notification"
  }],
  
  unread : { type : Number, default : 0}
},
  rooms : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Room"
  }]
}
,
{timestamps : true}  //.createdAt, .updatedAt
);


module.exports = mongoose.model("Client", userSchema);
