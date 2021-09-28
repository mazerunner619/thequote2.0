const mongoose = require("mongoose");

const NotifySchema = new mongoose.Schema({
    message : String,
    origin : Number,// (1)friend request || (2) comment || likes 
    read :{
        type : Boolean,
        default : false
    },

    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Client"
    }, 
    
    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Client"
    },
}
,
{timestamps : true}
);

module.exports =  mongoose.model("Notification", NotifySchema);
