const express = require('express');
const app = express();
const Route = require('./Routes/router');
const userRoute = require('./Routes/userRoute');
const errorHandler = require('./handlers/errorHandler');

const PORT = process.env.PORT || 5000;
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
require('dotenv/config');
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// app.use(errorHandler);
//error handler MW
app.use(function(err, req, res, next){
    res.status(err.status || 400).json({
        message : err.message
    });
});

app.get('/', (req, res)=>{
    res.send('running');
});
app.use('/', Route);
app.use('/user', userRoute);
  
mongoose.connect(process.env.CONN_STRING, 
    {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }, 
    function(error){
        if(error){ 
            console.log(error);
        }
        else{
            console.log("connected to DB quoteBlogs");
        }
    }
 );


if(process.env.NODE_ENV == "production"){
    app.use(express.static("quoteblog/build"));
}


app.listen(PORT, () => {
    console.log(`Server is running on port:5000`);
});