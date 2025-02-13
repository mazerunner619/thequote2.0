import React, { useEffect, useState } from "react";
import ClearChatModal from "./clearChat";
import socketClient from "socket.io-client";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUser } from "../ReduxStore/actions/userActions";
import { RiSendPlaneLine } from "react-icons/ri";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { GoPrimitiveDot } from "react-icons/go";
import { GiMoon } from "react-icons/gi";
import { BsClockHistory, BsMoonStars } from "react-icons/bs";

import "./component.css";
import Inbox from "./Inbox";

let socket;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid green`,
    background: "green",
    padding: "0 4px",
  },
}))(Badge);

export default function Chatting() {
  const hist = useHistory();

  const classes = useStyles();
  const dispatch = useDispatch();
  const [isChatting, setIsChatting] = useState(false);
  const { loggedUser } = useSelector((state) => state.userStore);
  const [friends, setFriends] = useState([]);
  const [chatwith, setWith] = useState(null);
  const [clearChatPage, setClearChatPage] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    !localStorage.getItem("darkmodechatquoteblog")
      ? false
      : localStorage.getItem("darkmodechatquoteblog") === "true"
  );
  const [lastMsgMap, setLastMsgMap] = useState(new Map());

  let chatinfo = [chatwith, loggedUser];
  const [msg, setMsg] = useState("");
  const [T, setT] = useState(0);

  function sendMessage(e) {
    e.preventDefault();
    if (!msg.length || loadingChat) return;
    socket.emit("newmsg", {
      sender: loggedUser,
      message: msg,
      timing: Date.now(),
    });
    document.getElementById("chatting-input").blur();
    setMsg("");
  }

  function notifyTyping(upordown) {
    if (upordown === 1) {
      socket.emit("typing", loggedUser);
    } else {
      socket.emit("!typing", loggedUser);
    }
  }

  function clearChatInitiate(a) {
    if (a) {
      socket.emit("clearchat");
      window.location.reload();
    } else {
      setClearChatPage(false);
    }
  }

  function fomatDate(date) {
    let newTime = new Date(date).toLocaleTimeString();
    return newTime;
  }

  function fomatDateOldMessages(date) {
    if (date + 86400 <= Date.now()) {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } else {
      return fomatDate(date);
    }
  }

  useEffect(() => {
    const getInfo = async () => {
      const userRes = await dispatch(getLoggedUser());
      if (userRes) {
        const { data } = await axios.get(`/getfriends/${userRes._id}`);
        setFriends(data);
        if (Array.isArray(data)) {
          setLastMsgMap(
            new Map(data.map((frnd) => [frnd._id, frnd.lastMessage]))
          );
        }
      } else {
        hist.push("/login");
      }
    };
    getInfo();
  }, []);

  //get all previous chats;
  useEffect(() => {
    socket = socketClient("https://thequoteblog.onrender.com/", {
      transports: ["websocket"],
    });

    socket.on("receivemsg", ({ message, sender, timing }) => {
      const objclass = sender._id === loggedUser._id ? "msg-right" : "msg-left";
      const newEle = document.createElement("p");
      const spanEle = document.createElement("span");
      spanEle.setAttribute("id", "time-span");
      spanEle.innerHTML = fomatDate(timing);
      newEle.innerHTML = message;
      newEle.setAttribute("class", objclass);
      newEle.appendChild(spanEle);
      const chatContainer = document.getElementById("chatting-body");
      document.getElementById("chatting-body").appendChild(newEle);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      lastMsgMap.set(sender._id, message);
    });
    socket.on("typing", () => {
      setT(1);
    });

    socket.on("!typing", () => {
      setT(0);
    });

    socket.on("msgSent", ({ other, message }) => {
      if (other === chatwith._id) {
        const newEle = document.createElement("p");
        const spanEle = document.createElement("span");
        spanEle.setAttribute("id", "time-span");
        spanEle.innerHTML = fomatDate(Date.now());
        newEle.innerHTML = message;
        newEle.setAttribute("class", "msg-right");
        newEle.appendChild(spanEle);
        const chatContainer = document.getElementById("chatting-body");
        chatContainer.appendChild(newEle);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        lastMsgMap.set(chatwith._id, message);
      }
    });

    socket.on("msgNotSent", () => {
      alert("msg not sent...");
    });

    return () => socket.off();
  }, [chatwith]);

  useEffect(() => {
    if (chatwith !== null) {
      socket.emit("startchat", chatinfo);
      setLoadingChat(true);
      socket.on("chathistory", (chatdata) => {
        document.getElementById("chatting-body").innerHTML = "";
        for (let ind = 0; ind < chatdata.length; ind++) {
          const objclass =
            chatdata[ind].sender === loggedUser._id ? "msg-right" : "msg-left";
          const newEle = document.createElement("p");

          const spanEle = document.createElement("span");
          spanEle.setAttribute("id", "time-span");
          spanEle.innerHTML = fomatDateOldMessages(chatdata[ind].date);
          newEle.innerHTML = chatdata[ind].content;
          newEle.setAttribute("class", objclass);
          newEle.appendChild(spanEle);
          document.getElementById("chatting-body").appendChild(newEle);
        }
        const chatContainer = document.getElementById("chatting-body");
        chatContainer.scrollTop = chatContainer.scrollHeight;
        setLoadingChat(false);
      });
    }
  }, [chatwith]);

  return (
    <div id="main-container" style={{ background: "black" }}>
      <div id="chat-list" style={{ display: isChatting ? "none" : "flex" }}>
        <div id="chats-body" className="hideScrollbars">
          <ul id="online-users" style={{ listStyle: "none", padding: "0" }}>
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <li
                  key={friend._id}
                  onClick={() => {
                    setWith(friend);
                    setIsChatting(true);
                  }}
                >
                  <div className={classes.root}>
                    {friend.profilePicture && friend.profilePicture.imageURL ? (
                      <>
                        <StyledBadge
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          overlap="circular"
                          invisible={!friend.active}
                          badgeContent={"online"}
                        >
                          <Avatar
                            style={{
                              border: friend.active
                                ? "2px solid lightgreen"
                                : "none",
                            }}
                            alt="user-dp"
                            src={friend.profilePicture.imageURL}
                          />
                        </StyledBadge>
                      </>
                    ) : (
                      <>
                        <StyledBadge
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          overlap="circular"
                          invisible={!friend.active}
                          badgeContent={"online"}
                        >
                          <Avatar
                            alt="user-dp"
                            src="https://images.unsplash.com/photo-1542550371427-311e1b0427cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
                          />
                        </StyledBadge>
                      </>
                    )}
                  </div>

                  <div id="chat-item-container">
                    <p>{friend.username}</p>
                    <p id="last-message">
                      {lastMsgMap && lastMsgMap.get(friend._id)}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <b
                style={{
                  textAlign: "center",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <i>you have no Friends</i> <br />
                <tt
                  onClick={() => hist.push(`/search/${"search friends"}`)}
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    padding: "3px",
                    color: "purple",
                    background: "black",
                    borderRadius: "5px",
                  }}
                >
                  find friends
                </tt>
              </b>
            )}
          </ul>
        </div>
      </div>

      {chatwith && (
        <Inbox
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          chatwith={chatwith}
          clearChatInitiate={clearChatInitiate}
          notifyTyping={notifyTyping}
          clearChatPage={clearChatPage}
          sendMessage={sendMessage}
          setMsg={setMsg}
          setClearChatPage={setClearChatPage}
          setIsChatting={setIsChatting}
          setWith={setWith}
          msg={msg}
          loadingChat={loadingChat}
          T={T}
        />
      )}
    </div>
  );
}
