const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../Models');
const bcrypt = require('bcrypt');


router.get('/removerooms', async(req, res) => {
    try{
        //   const data = await db.Chat.find({});
    const user = await db.Client.find({});
    user.forEach( async(U) => {
        U.active = false;
        await U.save(); 
    });

            res.send('done')
    }catch(err){
    }
});

router.get('/deletethis' , async (req, res) => {
    try{
    const user = await db.Client.find({});
    user.forEach( async(U) => {
        U.sentRequests = [];
        U.receivedRequests = [];
        U.friends = [];
        U.notifications = {
            notification  : [],
            unread : 0
        };
        await U.save();
    });

    await db.Request.deleteMany({});

    await db.Chat.deleteMany({});
    
    }catch(err){
        //console.log(err)
    }
});

//=================== get user friends
router.get('/getfriends/:userid' , async (req, res) => {
    try{
        const {userid} = req.params;
        //console.log('searching friends of ', userid);
        const user = await db.Client.findById(userid)
        .populate({path : "friends", select : "-password"});
        const friends = user.friends;
        res.send(friends);    
    }catch(err){
        //console.log(err)
    }
});



//========================= search users by username
router.get('/search/:username/:userid' , async (req, res, next) => {
    try{

        const {username, userid} = req.params;
        const requser = await db.Client.findById(userid)
        .populate({path : "sentRequests"});
        
        const user = await db.Client.find({});
        
        let searching = user.filter( info => {
            const uname = info.username.toLowerCase();
            return (uname.indexOf(username.toLowerCase())  === 0) && (requser._id.toString() !== info._id.toString());
        }); 
        
        let all = user.filter( info => {
            const uname = info.username.toLowerCase();
            return (uname.indexOf(username.toLowerCase())  === -1) && (requser._id.toString() !== info._id.toString());
        }); 

        all = all.map( obj => {
            const requestSent = requser.sentRequests.filter( SR => SR.to.toString() === obj._id.toString());
            const alreadyFriends = obj.friends.filter( FRND => FRND.toString() === requser._id.toString());
            //console.log(requestSent);
            //console.log(alreadyFriends);
            return{
                ...obj._doc,
                Sent : requestSent.length>0,
                Friends : alreadyFriends.length>0
            }
        } );
        
        searching = searching.map( obj => {
            const requestSent = requser.sentRequests.filter( SR => SR.to.toString() === obj._id.toString());
            const alreadyFriends = obj.friends.filter( FRND => FRND.toString() === requser._id.toString());
            //console.log(requestSent);
            //console.log(alreadyFriends);
            return{
                ...obj._doc,
                Sent : requestSent.length>0,
                Friends : alreadyFriends.length>0
            }
        } );
        //console.log(`search request for ${username}`);
        //console.log(`searching`, searching);
        // //console.log(`all`, all);

        res.json({
            searching,
            all
        });
    }catch(error){
        //console.log(error.message)
        return next({
            mesage : error.message
        });
    }
});

//================================search user by id
router.get('/getuser/:userID' ,async(req, res, next) => {
    try{
        const user = await db.Client.findById(req.params.userID)
        .populate({path : "posts friends receivedRequests", populate : {path : "from"}});
        //console.log(user,'=> form BE');
               return res.send(user);
    }catch(error){
        //console.log('get user route error ',error);
        return next({
            message : error.message
        });
    }
});

//================================search user by id
// router.get('/getS' ,async(req, res) => {
//     try{
//         const user = await db.Client.find({})
//         .select('-password');
//         // .populate({ path : "posts friends"});
//         res.send(user);
//     }catch(error){
//         //console.log('get user route error ',error);
//         res.send(null);
//     }
// });

//===================== CURRENT LOGGED USER if any
router.get('/current' ,async(req, res, next) => {
    try{

        const token = req.cookies.token;
        if(token){
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if(verified){
                const user = await db.Client.findById(verified.userId)
                .populate({path : "posts receivedRequests friends", populate : {path :"from"}});
                res.send(user);
            }
            else{
                //console.log('no logged in user found !');
                res.send(null);
            }
        }
        else{
            //console.log('null');
            res.send(null);
        }
    }catch(error){
        //console.log(error);
      res.send(null);
    }
});


//============== All Posts ===========
router.get('/getallposts' , async (req, res, next) => {
    try{
        const posts = await db.Post.find({})
        .populate({path : "uploader likes", select :"-password"}).sort({createdAt : 1});
        // //console.log('get all posts route success', posts);
        res.send(posts);
    }catch(error){
        return next({
            mesage : error.message
        });
    }
});


//===================SINGLE POST BY ID=====================
router.get('/getpost/:id' , async (req, res) => {
    try{
        const post = await db.Post.findById(req.params.id)
        .populate({path : "uploader", select : "-password"});
        //console.log('get post route success');
        res.send(post);
    }catch(err){
        return next({
            mesage : err.message
        });
    }
});

//=================== POSTS BY userID=====================
router.get('/getmyposts/:id' , async (req, res, next) => {
    try{
        const user = await db.Client.findById(req.params.id)
        .populate("posts");
        const posts = user.posts;
        //console.log(' from backend =====> ',posts);
        res.send(posts);
    }catch(err){
        return next({
            mesage : err.message
        });
    }
});

//====================LOGIN=============
router.post('/login', async(req, res, next) => {
    try{
        const {username, password } = req.body;
        console.log('logginng in with :',req.body)
        const user = await db.Client.findOne({username});
        if(!user){
            //console.log('wrong username');
            return res.json(false);
        }
        else {
            if(await bcrypt.compare(password,user.password)){
                //jwt work
                const token = jwt.sign({
                   userId : user._id,
                },
                process.env.JWT_SECRET_KEY 
                );
                //send the token to browser cookie
                console.log(`logged in as ${username} ${password}`);
                //io stuff
                // const sio = req.app.get('socketio');
                res.cookie( "token", token, {httpOnly : true}).send(true);
            }
            else{
                return res.json(false);
            }
        }
    }
    catch(error){
        //console.log(error);
        return next({
            message : error.message
        });    
    }
});


//=====================SIGNUP===============
router.post('/signup', async(req, res) => {
    const {username, password, confirmpassword } = req.body;
    try{

        if(password !== confirmpassword){
            return res.json({
                status : false,
                message : "passwords do not match !"
        });
    }
        const user = await db.Client.findOne({username});
        if(!user){
            if( password.length < 7)
            return res.json({
                status : false,
                message : "passwords too short (< 7) !"
        });
                const newU = new db.Client({
                    username, 
                    password :  await bcrypt.hash(password, 10)
                });

                newU.save();
                //console.log('registered ' + newU)
                res.json({status : true, message : "registered successfully"});
        }
        else{
            return res.json({
                status : false,
                message : "username already exists"
        });
        }

    }catch(error){
        //console.log(error);
        return next({
            message : "server-side error"
        });
    }   
});

module.exports = router;