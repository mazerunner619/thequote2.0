const express = require('express');
const router = express.Router();

const Quote = require('../Models/quoteModel');

router.post('/post' , (req, res) => {
    const newQuote = new Quote(
        {
            author : req.body.author,
            quote : req.body.quote,
        });
    newQuote.save();
    res.send(newQuote);
});

router.get('/disp' , async (req, res) => {
    try{
        const quotes = await Quote.find();
        res.send(quotes);
    }catch(err){
        res.send(err);
    }
});

router.get('/delete/:id', async (req, res) => {
    try{
       const rem = await Quote.deleteOne({_id : req.params.id});
       res.send(rem);
    }catch(err){
        res.send(err);
    }
});


router.post('/edit/:id', async (req, res) => {

        await Quote.updateOne(
           {_id : req.params.id},
           {quote : req.body.quote}
           );
           console.log('edited')
});

module.exports = router;