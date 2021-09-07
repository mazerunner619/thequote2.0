const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  uploader  :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client"
  },
  content : String,
  image : {
      imageID : String,
      imageURL : String
  },
  likes : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client"
  }],
  comments : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Comment"
  }],
}
,{timestamps : true}
);

module.exports =  mongoose.model("Post", postSchema);
