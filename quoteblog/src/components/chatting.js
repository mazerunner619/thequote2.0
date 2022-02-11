import React, {useEffect, useState} from 'react'
import ClearChatModal from './clearChat'
import socketClient from "socket.io-client";
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux'
import {getLoggedUser} from '../ReduxStore/actions/userActions'
import {RiSendPlaneLine} from 'react-icons/ri'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from 'react-router'
import {GoPrimitiveDot} from 'react-icons/go'
import {BsClockHistory} from 'react-icons/bs'
import {SiGhostery} from 'react-icons/si'
import Emoji from 'emoji-picker-react'

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
    const [clearChatPage, setClearChatPage] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    let chatinfo = [chatwith, loggedUser];   
    const [msg ,setMsg] = useState("");
    const [T, setT] = useState(0);
              
    function sendMessage(e){
        if(!msg.length)return;
        socket.emit("newmsg",{sender : loggedUser, message : msg, timing : Date.now()});
        setMsg("");
    }

    function notifyTyping(upordown){
      if(upordown === 1){
      socket.emit('typing',loggedUser);
      }else{
      socket.emit('!typing',loggedUser);
      }
    }

    function clearChatInitiate(a){
      if(a){
      socket.emit('clearchat');
      window.location.reload();
      }else{
      setClearChatPage(false);
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

    const [openEmoji, setOpenEmoji] = useState(false);

    function onEmojiClick(event, emojiObject){
      // const newMsg = msg + ' ' + emojiObject.emoji;
      setMsg(msg => msg+' '+emojiObject.emoji)
    };
  

    //get all previous chats;
        useEffect(() => {
          // socket = socketClient('http://localhost:8000/'); // development mode
          socket = socketClient('https://thequoteblog.herokuapp.com/', { transports : ['websocket']});
          const getInfo =async() => {
            const userRes  = await dispatch(getLoggedUser());
if(userRes){
             const {data} = await axios.get(`/getfriends/${userRes._id}`);
             console.log('Atif => ', data);
             setFriends(data);
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

          socket.on("msgSent", ({ other, message}) => {

            if(other === chatwith._id){
              const newEle = document.createElement('p');
            const spanEle = document.createElement('span');
            spanEle.setAttribute('id', "time-span");
            spanEle.innerHTML = fomatDate(Date.now());
            newEle.innerHTML = message;
            newEle.setAttribute('class', "msg-right");
            newEle.appendChild(spanEle);
              const chatContainer = document.getElementById("chatting-body");
              chatContainer.appendChild(newEle);
              chatContainer.scrollTop=chatContainer.scrollHeight;}
          });

          socket.on("msgNotSent", () => {
            alert('msg not sent...');
          });

          return ()=> socket.off();
        },[chatwith]);


        useEffect( ()=>{
          setLoadingChat(true);
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
                setLoadingChat(false);
            });
        },[chatwith])

    return (
      
        <div style={{background : "black"}}>
                <div id="chatting-page" style={{display : isChatting?"none" : "flex" }} >
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
  horizontal: 'left',
}}
overlap = "circular"
invisible = {!friend.active}
badgeContent={'online'}>
 <Avatar style = {{border : friend.active?"2px solid lightgreen":"none"}} alt="user-dp" src={friend.profilePicture.imageURL}/>
 </StyledBadge>
 </>
:
<>
<StyledBadge
anchorOrigin={{
  vertical: 'bottom',
  horizontal: 'left',
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
      <p>{friend.username}</p>
     <p id = "last-message">
      {friend.lastMessage}
    </p>

</li>)

:

<b style={{textAlign:"center", position:"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}><i>you have no Friends</i> {' '}
<br/>
<tt onClick={()=>hist.push(`/search/${'search friends'}`)}  style={{ textAlign : "center",cursor : "pointer", padding : "3px",color : "purple", background : "black", borderRadius : "5px"}}>find friends</tt>
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
      <div style={{width : "100%"}}>
            <div style={{display : "inline", float : "left", cursor : "pointer"}} id = "clearChat" onClick={()=>hist.push(`/show/${chatwith._id}/profile`)} >{chatwith.username}{' '}</div>
            <div style={{display : "inline", float : "left"}} onClick={()=>hist.push(`/show/${chatwith._id}/profile`)} >{chatwith.active?
            <GoPrimitiveDot style={{color :"lightgreen"}}/>:""}</div>
            <div style={{marginTop :"5px" ,display : "inline", float :"left"}}>{T ? " typing..." : ""}</div>
            <div id="clearChat" onClick={()=>setClearChatPage(true)}>
              clear chat <BsClockHistory style={{fontSize : "150%"}}/>
            </div>
      </div>
        </div>

<div id="chatting-body" className="hideScrollbars" style = {{opacity : loadingChat ? "0" : "1"}}>
</div>
                
                <div id="chatting-bottom">
                 <button id="chatting-emoji" onClick = {() => setOpenEmoji(x => !x)}><h3><SiGhostery className="text-white"/></h3></button>
                    <textarea className="hideScrollbars" id="chatting-input" onMouseDown={()=>setOpenEmoji(false)}  onKeyUp={() => {notifyTyping(1)}} onMouseLeave =   {() => notifyTyping(0)} autoComplete="off" placeholder = "message..." value = {msg} type="text" onChange={(e)=>setMsg(e.target.value)}/>
                  <button id="chatting-send" onClick = {(e) => sendMessage(e)}><h3><RiSendPlaneLine className="text-white" style={{transform : "rotateZ(45deg)", transitionDuration : "0.3s"}}/></h3></button>
                </div>

                <div style={{display : openEmoji ? "block" : "none"}} id = "emoji-picker">
                <Emoji 
                onEmojiClick={onEmojiClick} 
                native = {true}
                pickerStyle={{ width: '100vw', background : "#971243", color : "white", border : '0', borderRadius : "0"}}
                disableSkinTonePicker = {true}
                groupNames={{
                  smileys_people: 'yellow faces',
                  animals_nature: 'cute dogs and also trees',
                  food_drink: 'milkshakes and more',
                  travel_places: 'I love trains',
                  activities: 'lets play a game',
                  objects: 'stuff',
                  symbols: 'more stuff',
                  flags: 'fun with flags',
                  recently_used: 'kitomo\'s favourites',
                }}
                />
                </div>
<div>
</div>
</>
}
    </div>  
    <ClearChatModal 
          show={clearChatPage}
          onHide={() => setClearChatPage(false)}
          onConfirm = {() => clearChatInitiate(true)}
          onCancel = {() => clearChatInitiate(false)}
/>            
        </div>

    )
}

