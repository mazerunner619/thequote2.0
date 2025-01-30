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
    // let newDate = new Date(date).toLocaleDateString("en-US", {weekday : "short", month : "short", day : "numeric"});
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
    // socket = socketClient("http://localhost:8000/"); // development mode
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

      <div
        id={darkMode ? "chatting-page-dark" : "chatting-page"}
        style={{ display: isChatting ? "flex" : "none" }}
      >
        {chatwith && (
          <>
            <div id="chatting-header">
              <div>
                <ArrowBackIosIcon
                  id="chat-back-button"
                  onClick={() => {
                    setIsChatting(false);
                    setWith(null);
                  }}
                />
              </div>
              <div>
                {chatwith.profilePicture && chatwith.profilePicture.imageURL ? (
                  <Avatar
                    alt="user-dp"
                    src={chatwith.profilePicture.imageURL}
                  />
                ) : (
                  <Avatar
                    alt="user-dp"
                    src="https://images.unsplash.com/photo-1542550371427-311e1b0427cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
                  />
                )}
              </div>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "inline",
                    float: "left",
                    cursor: "pointer",
                  }}
                  id="clearChat"
                  onClick={() => hist.push(`/show/${chatwith._id}/profile`)}
                >
                  {chatwith.username}{" "}
                </div>
                <div
                  style={{ display: "inline", float: "left" }}
                  onClick={() => hist.push(`/show/${chatwith._id}/profile`)}
                >
                  {chatwith.active ? (
                    <GoPrimitiveDot style={{ color: "lightgreen" }} />
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{ marginTop: "5px", display: "inline", float: "left" }}
                ></div>

                <div
                  id="clearChat"
                  onClick={() => {
                    localStorage.setItem(
                      "darkmodechatquoteblog",
                      darkMode ? "false" : "true"
                    );
                    setDarkMode(!darkMode);
                  }}
                >
                  <GiMoon style={{ fontSize: "150%" }} />
                </div>

                <div id="clearChat" onClick={() => setClearChatPage(true)}>
                  <BsClockHistory style={{ fontSize: "150%" }} />
                </div>
              </div>
            </div>

            <div
              id="chatting-body"
              className="hideScrollbars"
              style={{ opacity: loadingChat ? "0" : "1" }}
            ></div>

            <div id="chatting-bottom">
              <img
                className={darkMode ? "dark-bg-typing" : "light-bg-typing"}
                style={{ display: T ? "block" : "none" }}
                src="https://assets-v2.lottiefiles.com/a/79602c98-1174-11ee-9f53-7b153f45c520/PtEKmqMfoQ.gif"
                alt="typing-gif"
              />
              <textarea
                className="hideScrollbars"
                id="chatting-input"
                onKeyUp={() => {
                  notifyTyping(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e);
                    notifyTyping(0);
                  }
                }}
                onMouseLeave={() => notifyTyping(0)}
                autoComplete="off"
                placeholder="message..."
                value={msg}
                type="text"
                onChange={(e) => setMsg(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      <ClearChatModal
        show={clearChatPage}
        onHide={() => setClearChatPage(false)}
        onConfirm={() => clearChatInitiate(true)}
        onCancel={() => clearChatInitiate(false)}
      />
    </div>
  );
}
