import { RiSendPlaneLine } from "react-icons/ri";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { GoPrimitiveDot } from "react-icons/go";
import { GiMoon } from "react-icons/gi";
import { BsClockHistory, BsMoonStars } from "react-icons/bs";
import ClearChatModal from "./clearChat";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router";

export default function Inbox({
  darkMode,
  setDarkMode,
  chatwith,
  sendMessage,
  notifyTyping,
  setMsg,
  clearChatPage,
  setClearChatPage,
  clearChatInitiate,
  setIsChatting,
  setWith,
  msg,
  loadingChat,
  T,
}) {
  const hist = useHistory();
  return (
    <div id="inbox">
      {chatwith && (
        <div
          id={darkMode ? "chatting-page-dark" : "chatting-page"}
          style={{ display: "flex" }}
        >
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
                <Avatar alt="user-dp" src={chatwith.profilePicture.imageURL} />
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
        </div>
      )}
      <ClearChatModal
        show={clearChatPage}
        onHide={() => setClearChatPage(false)}
        onConfirm={() => clearChatInitiate(true)}
        onCancel={() => clearChatInitiate(false)}
      />
    </div>
  );
}
