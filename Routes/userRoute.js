//edit a post <-> delete a post  <-> upload a post    => requires authorization
//commment to a post <-> like a post => requires logged user

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMW = require('../authMW');
const sendNotification = require('../handlers/notifyHandler');
//cloudinary and multer functions
const {upload, uploadToCloud, fileUpload, uploadFromURL} = require('../handlers/cloudinary');
const db = require('../Models');
const Compress = require('react-image-file-resizer');

const resizeFile = (file) =>
  new Promise((resolve, reject) => {
    Compress.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      50,
      0,
      (uri) => {
         //console.log(uri);
         resolve(uri);
      },
      "base64"
    );
  });

  
function isLoggedIn(req, res, next){
    const token = req.cookies.token;
    if(token){
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(verified){
            const clientID = req.params.userid;
            if(clientID === verified.userId)
            next();
            else 
            res.status(401).send('UNAUTHORIZED !');
        }else{
        res.status(401).send('UNAUTHORIZED !');
        }
    }else{
        res.status(401).send('UNAUTHORIZED !');
    }
}


router.post('/:userid/unfriend/:fid',isLoggedIn,async(req, res, next) => {
try{
    const {userid, fid} = req.params;
    const user = await db.Client.findById(userid);
    const friend = await db.Client.findById(fid);
    const userFriendlist = user.friends.filter( friend => friend.toString() !== fid.toString());
    const friendFriendlist = friend.friends.filter( friend => friend.toString() !== userid.toString());
    user.friends = userFriendlist;
    friend.friends = friendFriendlist;
    await user.save();
    await friend.save();
    res.send(true);
}catch(err){
    return next({
        message : err.message
    })
}
});
//========================================= update profle info 
router.post('/:userid/profile/update',upload.single('image'),async(req, res, next) => {
    try{
        //console.log('updating profile');
        const FILE = req.file;
        const {userid} = req.params;
        const {bio, username} = req.body;
        let image = {};
        const {dataid,dataurl} = await fileUpload(FILE);   
        image.imageID = dataid;
        image.imageURL = dataurl;
        const user = await db.Client.findById(userid);
        if(FILE)user.profilePicture=image;
        if(bio.length > 0){
            user.bio = bio;
        }
        
        if(username.length > 0){
            const alreadyexists = await db.Client.find({username : username});
            if(alreadyexists.length > 0 && alreadyexists[0].username !== user.username){
                //console.log('name already exists');
                return res.json({
                    status : false,
                    message : "username already exists"
                });
            }
            user.username = username;
        }
        await user.save();
        //console.log('uodated profile');

   return res.json({
                    status : true,
                    message : "your profile was updated"
                });
            }
        catch(error){
    return next({
        message : error.message
    });
}
});



//============== send Friend Request ===========
router.post('/request/:userid/:to' , isLoggedIn ,async (req, res, next) => {
    //console.log('sending request =>');
    try{
        const {userid, to} = req.params;

        const receiver = await db.Client.findById(to);
        if(!receiver){
            return res.json({
                mesage : 'Profile not found !',
                status : false
            });
        }

        const sender = await db.Client.findById(userid)
        .populate({ path : "sentRequests"});
        const alreadyRequested = sender.sentRequests.filter(id => id.to.toString() === to.toString());
        if(alreadyRequested.length > 0){
            //console.log('Request already pending !');
            return res.json({
                mesage : 'request already pending !',
                status : false
            });
        }

        const alreadyFriends = sender.friends.filter(id => id.toString() === to);
        if(alreadyFriends.length > 0){
            //console.log('already friends  !');

            return res.json({
                mesage : 'already friends !',
                status : false
            });
        }

        const newReq = await db.Request.create({
            from : userid,
            to
        });

        sender.sentRequests.push(newReq._id);
        receiver.receivedRequests.push(newReq._id);
        //send notification to receiver===============================================
        sendNotification(userid, to, "sent you a friend request");
        await sender.save();
        await receiver.save();
        //console.log('request sent');
        return res.json({
            mesage : 'request sent !',
            status : true
        });
    }catch(error){
        return next({
            mesage : error.message
        });
    }
});

//============== Accept Friend Request ===========
router.post('/:userid/requests/:reqid/accept' , isLoggedIn,async (req, res, next) => {
    //console.log('accepting reqeust');
    try{
        const {userid, reqid} = req.params;
        const R = await db.Request.findById(reqid);
        if(!R){
            return res.json({
                status : false,
                mesage : 'Request not found, might have been unsent from the user'
            });
        }
        if(R.to.toString() !== userid.toString() ){
            //console.log('unauthorized user');
            return res.json({
                status : false,
                message : 'unauthorized !!!'
            });
        }
        const receiver = await db.Client.findById(userid); 
        const alreadyFriends = receiver.friends.filter(id => id.toString() === R.from);
        if(alreadyFriends.length > 0){
            //console.log('already friends');
            return res.json({
                status : false,
                message : 'already friends !!!'
            });
        }        

        const sender = await db.Client.findById(R.from);
        await db.Request.findByIdAndDelete(reqid);
        
        sender.friends.push(userid);
        receiver.friends.push(R.from);

        const newReceivedR = receiver.receivedRequests.filter( R => R.toString() !== reqid.toString() );
        const newSentR = sender.sentRequests.filter( R => R.toString() !== reqid.toString());

        receiver.receivedRequests = newReceivedR;
        sender.sentRequests = newSentR;

        sendNotification(userid,R.from, "accepted your friend request");

        await sender.save();
        await receiver.save();

        //console.log('request accepted');
        res.json({
            message : "request accepted",
            status : true
        });

    }catch(error){
        return next({
            mesage : error.message
        });
    }
});



//============== DELETE Friend Request ===========
router.post('/:userid/requests/:reqid/delete' , isLoggedIn,async (req, res, next) => {
    //console.log('deleting reqeust');
    try{
        const {userid, reqid} = req.params;
        const R = await db.Request.findById(reqid);
        if(!R){
            return res.json({
                status : false,
                mesage : 'Request not found, might have been unsent from the user'
            });
        }
        if(R.to.toString() !== userid.toString() ){
            //console.log('unauthorized user');
            return res.json({
                status : false,
                message : 'unauthorized !!!'
            });
        }
        const receiver = await db.Client.findById(userid); 
        const alreadyFriends = receiver.friends.filter(id => id.toString() === R.from);
        if(alreadyFriends.length > 0){
            //console.log('already friends');
            return res.json({
                status : false,
                message : 'already friends !!!'
            });
        }        

        const sender = await db.Client.findById(R.from);
        // R.accepted = false;
        await db.Request.findByIdAndDelete(reqid);

        const newReceivedR = receiver.receivedRequests.filter( R => R.toString() !== reqid.toString() );
        const newSentR = sender.sentRequests.filter( R => R.toString() !== reqid.toString());

        receiver.receivedRequests = newReceivedR;
        sender.sentRequests = newSentR;

        // sendNotification(userid,req.from, "accepted your friend request"); || do not send rejection notification
        await sender.save();
        await receiver.save();    

        //console.log('request deleted');
        res.json({
            message : "request deleted",
            status : true
        });

    }catch(error){
        return next({
            mesage : error.message
        });
    }
});


//========================================= upload post 
router.post('/newpost/:userid',upload.single('image'),async(req, res, next) => {
    try{
        const FILE = req.file;
        //console.log('from backend initial file => ',FILE);
        const {userid} = req.params;
        const {content} = req.body;
        let image = {};

if(FILE){
        const fileRes = await fileUpload(FILE);   
        //console.log(fileRes, 'from backend fileupload');
        //console.log('final file => ',fileRes);
            image.imageID = fileRes.dataid,
            image.imageURL = fileRes.dataurl
    }
    else{
        const fileRes = await uploadFromURL("https://source.unsplash.com/random/900%C3%97700/?pink,cloud,moon");   
        //console.log(fileRes, 'from backend fileupload');
        image.imageID = fileRes.public_id,
        image.imageURL = fileRes.secure_url     
    }

       const newPost = await db.Post.create({
            uploader : userid,
            content : content,
            image : image
        });

        //console.log('new post',newPost);

    //add to users posts
        const user = await db.Client.findById(userid);
        user.posts.push(newPost._id);
        await user.save();
    return res.send(true);
}catch(error){
    return next({
        message : error.message
    });
}
});

//===============================================DELETE POST
router.delete('/:userid/delete/:postid', isLoggedIn,async (req, res, next) => {
    try{

        //console.log('n delete route');
        //console.log(req.params.userid);
//console.log(req.params.postid);
        const {userid, postid} = req.params;
        const post =  await db.Post.findById(postid);
        //console.log(post);
        if(post.uploader.toString() !== userid.toString()){
            return next({
                message : "wait a minute .... Who are you !!!"
            });
    }
    await db.Post.deleteOne({_id : postid});
    const user = await db.Client.findById(userid);
     const usersupdateposts = user.posts.filter( post => post.toString() !== postid.toString());
     user.posts = usersupdateposts;
     await user.save();

    return res.json(true);
    }catch(err){
  return next({
        message : err.message
    }); 
   }
});

//===========================LIKE | DISLIKE POST 
router.post('/:userid/like/:postid', isLoggedIn,async (req, res, next) => {
    try{

        const {userid, postid} = req.params;
        const post =  await db.Post.findById(postid);
        const alreadyLiked = post.likes.filter( liker => liker.toString() === userid.toString());

        if(alreadyLiked.length > 0){//dislike
            const newLikes = post.likes.filter(liker => liker.toString() !== userid.toString());
            post.likes = newLikes;
            await post.save();

        }else{//like
            post.likes.push(userid);
            sendNotification(userid,post.uploader,"liked your post");
            await post.save();
        }
        res.json(true);
    }catch(err){
  return next({
        message : err.message
    }); 
   }
});

//===================================COMMENT ON POST
router.post('/:userid/comment/:postid', isLoggedIn,async (req, res, next) => {
    try{
        const {userid, postid} = req.params;
        const {comment} = req.body;
        const post =  await db.Post.findById(postid);
        const user = await db.Client.findById(userid);

        const eligible = user.friends.filter(fid => fid.toString() === userid.toString());
        if(!eligible.length){
            return next({
                message : "you can comment only to posts of your friends"
            });
        }
        const newComment =  await db.Comment.create({
            comment,
            commentBy : userid,
            commentTo : post.uploader    
        });

        post.comments.push(newComment._id);
        sendNotification(userid,post.uploader,"commented on your post");
        res.json(true);
    }catch(err){
  return next({
        message : err.message
    }); 
   }
});


//=======================================EDIT POST 
router.post('/:userid/edit/:postid',isLoggedIn,async (req, res, next) => {
try{
    //console.log('n edut route');
    const {userid, postid} = req.params;
    const {content} = req.body;
    const post =  await db.Post.findById(postid);
    if(post.uploader.toString() !== userid.toString()){
        return next({
            message : "F*CK you :)"
        });
}
    post.content = content;
    await post.save();
    res.json(true);
}catch(err){
    //console.log(err.message);
    return next({
        message : err.message
    });
}
    
});


//==================================== GET NOTIFICATIONs by userID
router.get('/notifications/:userid',async (req, res, next) => {
    try{
        //console.log('notifications :=>', req.params.userid);
        const {userid} = req.params;
        const user = await db.Client.findById(userid)
        .populate({path : "notifications.notification", populate : {path : "from"}});
        user.notifications.unread = 0;
        const data = user.notifications.notification;
        await user.save();
        //console.log('notifications :=> ',data);
        res.send(data);
    }catch(err){
        //console.log(err.message);
        return next({
            message : err.message
        });
    }
});


//==================================== GET ROOMSs by userID
router.get('/rooms/:userid',async (req, res, next) => {
    try{
        //console.log('rooms :=>', req.params.userid);
        const {userid} = req.params;
        const user = await db.Client.findById(userid)
        .populate({path : "rooms", populate : {path : "admin members"}});

        const data = user.rooms;
        //console.log('rooms :=> ',data);
        res.send(data);
    }catch(err){
        //console.log(err);
        return next({
            message : err.message
        });
    }
});

//==================================== DELETE ALL NOTIFICATIONS by user id
router.post('/:userid/notification/deleteall',isLoggedIn, async (req, res, next) => {
    try{
        const {userid} = req.params;
        const user = await db.Client.findById(userid);
        user.notifications.notification = [];
        await user.save();
        let notices = await db.Notification.find({});
        //console.log('initial',notices.length);

        await db.Notification.deleteMany({to : userid});

        notices = await db.Notification.find({});
        //console.log('final',notices.length);

        res.json(true);
    }catch(err){
        //console.log(err.message);
        return next({
            message : err.message
        });
    }   
});

//==================================== DELETE NOTIFICATION by ID
router.post('/:userid/notification/:nid/delete',isLoggedIn ,async (req, res, next) => {
    try{
        const {userid, nid} = req.params;
        const user = await db.Client.findById(userid);
        const noti = await db.Notification.findById(nid);
        if(noti.to.toString() !== userid.toString()){
            //console.log('you cannot delete others notifications');
            return res.json(false);
        }
        const updatedN = user.notifications.notification.filter(id => id.toString() !== nid.toString());
        user.notifications.notification = updatedN;
        await user.save();
        await db.Notification.deleteOne({ _id : nid });
        res.json(true);
    }catch(err){
        //console.log(err.message);
        return next({
            message : err.message
        });
    }
        
    });

//========================== LOGOUT
router.post('/:userid/logout' , async(req, res) => {

    const user = await db.Client.findById(req.params.userid);
    console.log(` ${user.username} logged out `);
    user.active = false;
    await user.save();
    res.cookie("token", "",{
    httpOnly : true,
    expires : new Date(0)
    }).send(`${user.username}logged out !`);
})

module.exports = router;