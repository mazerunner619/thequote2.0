import React, {useEffect, useState, useRef} from 'react'
// import {Col, Button, Form, Card, Accordion, Nav} from 'react-bootstrap'
import {Modal, Button ,Form,Accordion,Card, Row,Nav, Col} from 'react-bootstrap'
import { RiSendPlaneLine} from 'react-icons/ri'
import socketClient from "socket.io-client";
import {IoIosAdd} from 'react-icons/io';
import axios from 'axios'
import { css } from '@emotion/css'
import './component.css'
import $ from 'jquery'
let socket;

function ChatPage({ chatUser , me}) {

    let chatinfo = [chatUser,me];   
    const [msg ,setMsg] = useState("");
    const [T, setT] = useState(0);

    const messagesEndRef = useRef(null);

              
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


            document.getElementById("chatting-body").innerHTML = '';
              for(let ind = 0 ; ind < chatdata.length ; ind++){
              const objclass = (chatdata[ind].sender === me._id) ? "msg-right" : "msg-left"; 
              const newEle = document.createElement('p');
              newEle.innerHTML = chatdata[ind].content;
              newEle.setAttribute('class', objclass);
              document.getElementById("chatting-body").appendChild(newEle);
            }  

            const chatContainer = document.getElementById("chatting-body");
            chatContainer.scrollTop=chatContainer.scrollHeight;

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
            <Col lg = {9} md={9}  className="m-0 p-0">
<div id = "chatting-page">
  {
    chatUser ?
    <>
      
      <div id="chatting-header">
                    <h2>{chatUser.username}</h2>
                    <p style={{color : "green"}}>{T ? "typing..." : ""}</p>
                </div>



<div id="chatting-body" className="hideScrollbars">

</div>
                
                <div id="chatting-bottom">
                    <input id="chatting-input"  onKeyUp={() => notifyTyping(1)} onMouseLeave={() => notifyTyping(0)} placeholder = "message" value = {msg} type="text" onChange={(e)=>setMsg(e.target.value)} onKeyDown = {(e) => (e.keyCode === 13) ? sendMessage(e) : ""}/>
                    <button id="chatting-send" onClick = {(e) => sendMessage(e)}><h3><RiSendPlaneLine className="text-white" style={{transform : "rotateZ(45deg)", transitionDuration : "0.3s"}}/></h3></button>
                </div>
    </>
    :
    <b style={{textAlign:"center", position:"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}><i>Start a conversation</i></b>
  }

    </div>
             </Col>

    )
}

export default ChatPage;


