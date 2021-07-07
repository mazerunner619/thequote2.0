const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');

router.get('/current' ,async(req, res) => {
    const token = req.cookies.token;
    if(token){
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(verified){
            const user = await User.findById(verified.userId);
            res.send(user);
            console.log('sent : '+user)
        }
        else{
            console.log('null');
            res.send(null);
        }
    }
    else{
        console.log('null');
        res.send(null);
    }
});

//not used this middleware currently

// async function checkUser(req, res, next){
//     const token = req.cookies.token;
//     if(token){
//         const verified = jwt.verify(token,process.env.JWT_SECRET_KEY);
//         if(verified){
//             const user = await User.findById(verified.userId);
//             console.log(user);
//             res.locals.currentUser = user.username;
//             next();
//         }
//         else{
//             console.log('null');
//             res.locals.currentUser = null;
//             next()
//         }
//     }
//     else{
//         console.log('null');
//         res.locals.currentUser = null;
//         next()
//     }
// }

// fetch all reg. users
router.get('/' ,async(req, res) => {
    try{
        const users = await User.find({});
    res.send(users);
    }catch(error){
        res.send(error);
    }
});

router.get('/del', async(req, res) => {
    await User.deleteMany({});
    res.send('cleared the user colletion');
});


//check if user is logged in ? By checking if a cookie is present on client side -> if present is it verified (jwt)

router.get('/isLogged', async(req, res) => {
    const token = req.cookies.token;
    console.log(token);
    try{
    
        if(!token) {
            console.log('not logged in');
            return res.json(false);
        }

        //else verify the token with jwt secret key
        jwt.verify( token, process.env.JWT_SECRET_KEY );
        
        console.log('logged in');
        res.json(true);  ///cookie is present with this token
    }catch(error){
        console.log(error);
        res.json(false);
    }
})

//login user => creatw token when user logs in successfully
router.post('/login', async(req, res) => {

    const {username, password } = req.body;

    console.log('in user login router => user : '+req.body.username);

    try{
        const user = await User.findOne({username});
        if(!user){
            res.send('wrong username');
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
                console.log('logged in as '+user.username);
                res.cookie( "token", token, {httpOnly : true}).send();
            }
            else{
                res.send('wrong password')
            }
        }

    }
    catch(error){
        res.send('serverside ErrOR'+error);
    }
      
});


//signup user
router.post('/signup', async(req, res) => {
    const {username, password } = req.body;
    try{
        const user = await User.findOne({username});
        if(!user){
            if( password.length < 7)
            return res.send('password too short')
            
                const newU = new User({
                    username, 
                    password :  await bcrypt.hash(password, 10)
                });

                newU.save();
                console.log('registered ' + newU)
                res.send('registered successfully');
        }
        else{
            console.log('seems username is already taken !')
            res.send('seems username is already taken !')
        }

    }catch(error){
        console.log(error);
    }   
});

router.get('/logout' , (req, res) => {
    res.cookie("token", "",{
    httpOnly : true,
    expires : new Date(0)
    }).send();
})

module.exports = router;

