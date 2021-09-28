import React, {useEffect, useState, createElement} from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import socketClient from "socket.io-client";
import {useDispatch, useSelector} from 'react-redux'
import {getLoggedUser, getLoggedUserRooms} from '../ReduxStore/actions/userActions'
import ChatPage from './chatPage';
import StartChat from './joinCreateRoomModal'
import {AiOutlinePlus} from 'react-icons/ai'
import {RiCheckboxBlankCircleFill} from 'react-icons/ri'
import axios from 'axios';
import $ from 'jquery'
import './component.css'

// const socket = socketClient();
let socket;

export default function Chatting() {

    const dispatch = useDispatch();

    const [isChatting ,setIsChatting] = useState(false)

    const {loggedUser, loggedIn, userRooms} = useSelector( state => state.userStore)

    const [friends, setFriends] = useState([]);
    const [chatwith, setWith] = useState(null);

        useEffect(() => {
            socket = socketClient('http://localhost:5000/', { transports : ['websocket']});
            socket.on("connect", () => console.log(`chatting connected !`));
            const getInfo =async() => {
               const userRes  = await dispatch(getLoggedUser());
                const {data} = await axios.get(`/getfriends/${userRes._id}`);
                setFriends(data);
                console.log('loggedUser ', userRes)
                await socket.emit('useronline', userRes);
            }
            getInfo();
        },[]);



    return (
        <div>
        <Row className="m-0 justify-content-center p-0" >
            <Col lg = {3} md={3} className="m-0 p-0">
                <div id="chatting-page">

                <div id="chatting-header">
                <h2>{'chats'}</h2>
                </div>
                <div id="chats-body"  className = "hideScrollbars">
                   <ul  id="online-users" style={{ listStyle: "none" ,padding: "0"}}>
    {
    friends.length>0 && friends.map( (friend, index) =>
    <li onClick = {()=>{
        setWith(friend);
        setIsChatting(true);
    }}>
        {friend.username}
    </li>)
    }
                   </ul>
                </div>
                </div>
            </Col>
            {/* <ChatPage me={loggedUser} chatUser = {chatwith}/> */}
        </Row>
              
<StartChat
        show = {isChatting}
        onHide={() => setIsChatting(false)}
        me = {loggedUser}
        chatUser = {chatwith}
      />  

        </div>

    )
}

