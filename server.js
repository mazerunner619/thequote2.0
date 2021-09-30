const db = require('./Models');
const jwt = require('jsonwebtoken');
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
const { Socket } = require('dgram');
const { request } = require('https');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

require('dotenv/config');

const server = app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});

const io = require('socket.io')(server, {
    cors : {
        origin : ['http://localhost:3000']
    },
});

app.set('socketio', io);


    io.on("connection", (socket) => {
        console.log('socket.io connected !');
        let currentUser = {};
        console.log('new user connected with id ',socket.id);

        socket.on("useronline", async(data) => {

            console.log('socket request to backend');

            if(!data){
                console.log('user not logged in');
                throw new Error('user not logged in !');
            }
       
            console.log('data => ', data.username);
            const theloggeduser = await db.Client.findById(data._id);
             theloggeduser.active = true;
             await theloggeduser.save();

            currentUser[socket.id]= data._id;
            currentUser['username'] = data.username;
            console.log(`${theloggeduser._id} is now online`);

        });


        
        socket.on("startchat", async(data) => {

            if(!data[0].username || !data[1].username){
                console.log('something is wrong......receipients are missing !');
                throw new Error('receipients missing');
            }
            console.log('chat started b/w =>',data[0].username , data[1].username)
            let room;
            //find if any previous chats
            const reverseRecepients = [data[1]._id, data[0]._id];
            const thisChat = await db.Chat.findOne({$or:[{recepients : [data[0]._id, data[1]._id]} , {recepients : reverseRecepients}]});

            if(thisChat){
                console.log(`chat hist of ${data[0].username} and ${data[1].username}`, thisChat.chats);
                socket.emit("chathistory", thisChat.chats);
                room = thisChat._id;
                console.log(`${socket.id} joined room ${room}`);
                await socket.join(room.toString());
                console.log('ROOOMS',socket.rooms);
            }else{
                //start a new conversation
                console.log(` no chat hostory found for ${data[0].username} and ${data[1].username}`);
                const newChat = await db.Chat.create({
                    recepients : [data[0]._id, data[1]._id]
                });

                room = newChat._id;
                console.log(`${socket.i} joined room ${room}`);
                await socket.join(room.toString());
                console.log('ROOOMS',socket.rooms);
            }

            socket.on("typing",  (typer) => {
                console.log(`${typer.username}  is typing...`);
                socket.broadcast.to(room.toString()).emit("typing");
            })

            socket.on("!typing",  (typer) => {
                console.log(`${typer.username} is not typing...`);
                socket.broadcast.to(room.toString()).emit("!typing");
            })

            socket.on("newmsg", async({sender, message, timing}) => {
                console.log(`${message} : ${sender.username} in room ${room} at ${timing}`);
                //save to DB this message
                const thisChat = await db.Chat.findOne({$or:[{recepients : [data[0]._id, data[1]._id]} , {recepients : reverseRecepients}]});
                if(!thisChat){
                    console.log('strange error not found this chat on line -- 94');
                    throw err;
                }else{ 
                    thisChat.chats.push({
                        content : message,
                        sender : sender._id
                    });
                    await thisChat.save();
                    console.log('receivemsg');
                    socket.broadcast.to(room.toString()).emit("receivemsg", {message, sender, timing});
                // io.to(room.toString()).emit("receivemsg", {message, sender});
                }
    
            });

        });


        socket.on("disconnect", async() => {
            console.log('user offline ', currentUser[socket.id]);
            await db.Client.updateOne({ _id : currentUser[socket.id]}, { $set : {active : false}}, (err, done) => {
                if(err){
                    console.log(err);
                    throw err;
                }
            });
        });

        socket.on("getoffline", async() => {
            console.log('user offline ', currentUser[socket.id]);
            await db.Client.updateOne({ _id : currentUser[socket.id]}, { $set : {active : false}}, (err, done) => {
                if(err){
                    console.log(err);
                    throw err;
                }
            });
        });

        //add a new online user

    })

app.use(function(err, req, res, next){
    console.log('running middleware')
    res.status(err.status || 400).json({
        message : err.message
    });
}); 

app.use('/', Route);
app.use('/user', userRoute);


if(process.env.NODE_ENV == "production"){
    app.use(express.static("quoteblog/build"));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'quoteblog', 'build', 'index.html'));
    });
}


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


