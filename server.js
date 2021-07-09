const express = require('express');
const app = express();
const Route = require('./Routes/router');
const userRoute = require('./Routes/userRoute');

const PORT = process.env.PORT || 5000;
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const Quote = require('./Models/quoteModel');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

require('dotenv/config');

app.use(bodyParser.json());

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.get('/quotes', async function(req, res) {

    try{
        const quotes = await Quote.find();
        res.send(quotes);
        console.log('fetching successfull  ....');

    }catch(err){
        console.log('fetching unsuccessfull  ....');
 }
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