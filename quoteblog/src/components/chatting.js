import React, {useEffect, useState} from 'react'
import socketClient from "socket.io-client";
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux'
import {getLoggedUser} from '../ReduxStore/actions/userActions'
import {RiSendPlaneLine} from 'react-icons/ri'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from 'react-router'
import {BiRefresh} from 'react-icons/bi'
import './component.css'
let socket;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  const StyledBadge = withStyles((theme) => ({
    badge: {
      right: -3,
      top: 13,
      border: `2px solid green`,
      background : "green",
      padding: '0 4px',
    },
  }))(Badge);


export default function Chatting() {

  const hist = useHistory();

    const classes = useStyles();
    const dispatch = useDispatch();
    const [isChatting ,setIsChatting] = useState(false)
    const {loggedUser} = useSelector( state => state.userStore)
    const [friends, setFriends] = useState([]);
    const [chatwith, setWith] = useState(null);
    const [load, setLoad] = useState(0);

    let chatinfo = [chatwith, loggedUser];   
    const [msg ,setMsg] = useState("");
    const [T, setT] = useState(0);
              
    function sendMessage(e){
        if(!msg.length)return;
        socket.emit("newmsg",{sender : loggedUser, message : msg, timing : Date.now()});
          const newEle = document.createElement('p');
          const spanEle = document.createElement('span');
          spanEle.setAttribute('id', "time-span");
          spanEle.innerHTML = fomatDate(Date.now());
          newEle.innerHTML = msg;
          newEle.setAttribute('class', "msg-right");
          newEle.appendChild(spanEle);
            const chatContainer = document.getElementById("chatting-body");
            chatContainer.appendChild(newEle);
            chatContainer.scrollTop=chatContainer.scrollHeight;
        setMsg("");
    }

    function notifyTyping(upordown){
      if(upordown === 1){
      socket.emit('typing',loggedUser);
      }else{
      socket.emit('!typing',loggedUser);
      }
    }

    function fomatDate(date){
      // let newDate = new Date(date).toLocaleDateString("en-US", {weekday : "short", month : "short", day : "numeric"});
      let newTime = new Date(date).toLocaleTimeString();
      return newTime;
    }

    function fomatDateOldMessages(date){
      let newDate = new Date(date).toLocaleDateString("en-US", {weekday : "short", month : "short", day : "numeric"});
      // let newTime = new Date(date).toLocaleTimeString();
      return newDate;
    }

    //get all previous chats;
        useEffect(() => {
          setLoad(1);
          socket = socketClient('https://thequoteblog.herokuapp.com/', { transports : ['websocket']});
          const getInfo =async() => {
            const userRes  = await dispatch(getLoggedUser());
if(userRes){
             const {data} = await axios.get(`/getfriends/${userRes._id}`);
             setFriends(data);
             setLoad(0);
}
else{
hist.push('/login');
}
}
         getInfo();

         if(chatwith){
          socket.on("connect", ()=>console.log(`im ( ${loggedUser.username} ) connected with ${chatwith.username}`))
             socket.emit("startchat", chatinfo);
          }


        // socket.on("connect", () => console.log(`chat connected !`));

          socket.on("chathistory",(chatdata) => {

            document.getElementById("chatting-body").innerHTML = '';
              for(let ind = 0 ; ind < chatdata.length ; ind++){
              const objclass = (chatdata[ind].sender === loggedUser._id) ? "msg-right" : "msg-left"; 
              const newEle = document.createElement('p');
              const spanEle = document.createElement('span');
              spanEle.setAttribute('id', "time-span");
              spanEle.innerHTML = fomatDateOldMessages(chatdata[ind].date);
              newEle.innerHTML = chatdata[ind].content;
              newEle.setAttribute('class', objclass);
            newEle.appendChild(spanEle);
              document.getElementById("chatting-body").appendChild(newEle);
            }  
            const chatContainer = document.getElementById("chatting-body");
            chatContainer.scrollTop=chatContainer.scrollHeight;
        });
          socket.on("receivemsg", ({message, sender, timing})=> {

            const objclass = (sender._id === loggedUser._id) ? "msg-right" : "msg-left"; 
            const newEle = document.createElement('p');
            const spanEle = document.createElement('span');
            spanEle.setAttribute('id', "time-span");
            spanEle.innerHTML = fomatDate(timing);
            newEle.innerHTML = message;
            newEle.setAttribute('class', objclass);
            newEle.appendChild(spanEle);
            const chatContainer = document.getElementById("chatting-body"); 
            document.getElementById("chatting-body").appendChild(newEle);
            chatContainer.scrollTop=chatContainer.scrollHeight;

          });
          socket.on("typing", () => {
            setT(1);
          });

          socket.on("!typing", () => {
            setT(0);
          });
          return ()=> socket.off();
        },[chatwith]);


        useEffect( ()=>{

            socket.on("chathistory",(chatdata) => {
                document.getElementById("chatting-body").innerHTML = '';
                  for(let ind = 0 ; ind < chatdata.length ; ind++){
                  const objclass = (chatdata[ind].sender === loggedUser._id) ? "msg-right" : "msg-left"; 
                  const newEle = document.createElement('p');

                  const spanEle = document.createElement('span');
                  spanEle.setAttribute('id', "time-span");
                  spanEle.innerHTML = fomatDate(chatdata[ind].date);
                  newEle.innerHTML = chatdata[ind].content;
                  newEle.setAttribute('class', objclass);
                  newEle.appendChild(spanEle);
                  document.getElementById("chatting-body").appendChild(newEle);
                }  
                const chatContainer = document.getElementById("chatting-body");
                chatContainer.scrollTop=chatContainer.scrollHeight;
            });
        },[chatwith])

    return (
      
        <div style={{background : "black"}}>
                <div id="chatting-page" style={{display : isChatting?"none" : "flex" }} >
                  {/* <h1><BiRefresh style={{cursor : "pointer", float : "right", width : "maxontent"}} onClick = { () => {
                    window.location.reload();
                  }}/></h1> */}
                <div id="chats-body"  className = "hideScrollbars">
                   <ul  id="online-users" style={{ listStyle: "none" ,padding: "0"}}>
    {
    friends.length>0 ?
    friends.map( (friend, index) =>
    <li onClick = {()=>{
        setWith(friend);
        setIsChatting(true);
    }}>

        <div className={classes.root} >     
{

(friend.profilePicture && friend.profilePicture.imageURL)?
<>
<StyledBadge
anchorOrigin={{
  vertical: 'bottom',
  horizontal: 'right',
}}
overlap = "circular"
invisible = {!friend.active}
badgeContent={'online'}>
 <Avatar alt="user-dp" src={friend.profilePicture.imageURL}/>
 </StyledBadge>
 </>
:
<>
<StyledBadge
anchorOrigin={{
  vertical: 'bottom',
  horizontal: 'right',
}}
overlap = "circular"
invisible = {!friend.active}
badgeContent={'online'}>
<Avatar alt="user-dp" 
src="https://images.unsplash.com/photo-1542550371427-311e1b0427cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
/>
</StyledBadge>
</>
}
        </div>
      <div>
            {friend.username}
    </div>
</li>)

:

<b style={{textAlign:"center", position:"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}><i>you have no Friends</i> {' '}
<br/>
<tt onClick={()=>hist.push(`/search/${'random'}`)}  style={{ textAlign : "center",cursor : "pointer", padding : "3px",color : "purple", background : "black", borderRadius : "5px"}}>find friends</tt>
</b>

}

</ul>
                </div>
</div>



<div id = "chatting-page" style={{display : isChatting?"flex" : "none"}}>
  {
    chatwith && 
    <>
      <div id="chatting-header">

        <div>
        <ArrowBackIosIcon id="chat-back-button" onClick = {()=>setIsChatting(false)}/>
        </div>
      <div>     
{

(chatwith.profilePicture && chatwith.profilePicture.imageURL)?
 <Avatar alt="user-dp" src={chatwith.profilePicture.imageURL}/>
:
<Avatar alt="user-dp" 
src="https://images.unsplash.com/photo-1542550371427-311e1b0427cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
/>
}
        </div>
      <div onClick={()=>hist.push(`/show/${chatwith._id}/profile`)} style={{cursor : "pointer"}}>
            {chatwith.username}
    </div>
                    <div>{T ? " is typing..." : ""}</div>
        </div>

<div id="chatting-body" className="hideScrollbars">

</div>
                
                <div id="chatting-bottom">
                    <input id="chatting-input"  onKeyUp={() => notifyTyping(1)} onMouseLeave={() => notifyTyping(0)} placeholder = "message..." value = {msg} type="text" onChange={(e)=>setMsg(e.target.value)} onKeyDown = {(e) => (e.keyCode === 13) ? sendMessage(e) : ""}/>
                    <button id="chatting-send" onClick = {(e) => sendMessage(e)}><h3><RiSendPlaneLine className="text-white" style={{transform : "rotateZ(45deg)", transitionDuration : "0.3s"}}/></h3></button>
                </div>
</>
}
    </div>              
        </div>

    )
}

