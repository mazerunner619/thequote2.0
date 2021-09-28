import { useEffect, useState } from 'react';
import {Modal,Col, CloseButton, InputGroup , Image, Row, FormControl, Alert ,Form} from 'react-bootstrap'
import {Button} from '@material-ui/core'
import axios from 'axios';
import { useHistory } from 'react-router';
import {editPost} from '../ReduxStore/actions/authActions';
import {connect,useSelector , useDispatch} from 'react-redux'
import {updateProfileInfo,getLoggedUser} from '../ReduxStore/actions/userActions'
import {AiTwotoneCamera} from 'react-icons/ai'
import socketClient from "socket.io-client";
import { RiSendPlaneLine} from 'react-icons/ri'



let socket;

export default function StartChat({
  chatUser, me , onHide ,show
}) {

  let chatinfo = [chatUser,me];   
  const [msg ,setMsg] = useState("");
  const [T, setT] = useState(0);


            
  function sendMessage(e){
      socket.emit("newmsg",{sender : me, message : msg});
        const newEle = document.createElement('p');
        newEle.innerHTML = msg;
        newEle.setAttribute('class', "msg-right");

          const chatContainer = document.getElementById("chatting-body");
          chatContainer.appendChild(newEle);
          chatContainer.scrollTop=chatContainer.scrollHeight;
      setMsg("");
  }

  function notifyTyping(upordown){
    if(upordown === 1){
    socket.emit('typing',me);
    }else{
    socket.emit('!typing',me);
    }
  }
  //get all previous chats;
      useEffect(() => {
        
        socket = socketClient('http://localhost:5000/', { transports : ['websocket']});
        
        if(chatUser){
        socket.on("connect", ()=>console.log(`im ( ${me.username} ) connected with ${chatUser.username}`))
           socket.emit("startchat", chatinfo);
        }
        

      socket.on("connect", () => console.log(`chat connected !`));

        socket.on("chathistory",(chatdata) => {
          const elem = document.getElementById("chatting-body")
                if(elem){
                elem.innerHTML = '';
                for(let ind = 0 ; ind < chatdata.length ; ind++){
                  const objclass = (chatdata[ind].sender === me._id) ? "msg-right" : "msg-left"; 
                  const newEle = document.createElement('p');
                  newEle.innerHTML = chatdata[ind].content;
                  newEle.setAttribute('class', objclass);
                  document.getElementById("chatting-body").appendChild(newEle);
                }  
                elem.scrollTop=elem.scrollHeight;
                }
      });

        socket.on("receivemsg", ({message, sender})=> {
          console.log(` ${message} from ${sender.username}`);
          console.log(`received message ${message} form ${sender.username}`);
          const objclass = (sender._id === me._id) ? "msg-right" : "msg-left"; 
          const newEle = document.createElement('p');
          newEle.innerHTML = message;
          newEle.setAttribute('class', objclass);
          document.getElementById("chatting-body").appendChild(newEle);

          const chatContainer = document.getElementById("chatting-body");
          chatContainer.scrollTop=chatContainer.scrollHeight;

        });

        socket.on("typing", () => {
          setT(1);
        });
        
        socket.on("!typing", () => {
          setT(0);
        });

        return ()=> socket.off();

      },[chatUser]);
  
return (
  <Modal
  show = {show}
  onHide = {onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    className="p-0 mt-2 ml-auto mr-auto mb-0"
    style={{height : "100vh", borderRadius : "10px", border : "0"}}
  >
    <Modal.Header 
    style={{height : "10vh", border : "0", background:"#971243"}}
    >

    <Modal.Title id="contained-modal-title-vcenter">
      {
        chatUser &&
         <h3 style = {{color : "white",  fontFamily :"fantasy", letterSpacing : "2px"}}>
      {chatUser.username}
      </h3>
}
      </Modal.Title>

      <Button variant="secondary" aria-hidden="true" onClick={onHide}>&times;</Button>
    </Modal.Header>

    <Modal.Body 
    style={{height : "65vh", overflow : "hidden", background : "black", border : "0"}}
    >

<div id="chatting-page" >
{
chatUser &&
<div id="chatting-body" className="hideScrollbars">
  </div>
}

</div>

    </Modal.Body>

    <Modal.Footer
    style={{margin : "0", padding:  "0", background : "black", border : "0"}}
   >
<div id="chatting-bottom">
                <input id="chatting-input"  onKeyUp={() => notifyTyping(1)} onMouseLeave={() => notifyTyping(0)} placeholder = "message" value = {msg} type="text" onChange={(e)=>setMsg(e.target.value)} onKeyDown = {(e) => (e.keyCode === 13) ? sendMessage(e) : ""}/>
                <button id="chatting-send" onClick = {(e) => sendMessage(e)}><h3><RiSendPlaneLine className="text-white" style={{transform : "rotateZ(45deg)", transitionDuration : "0.3s"}}/></h3></button>
            </div>
     </Modal.Footer>
  </Modal>
);

  }


  