import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Quote from "./collectionPage";
// import Navi from './Navi';
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./auths/login";
import Signup from "./auths/signup";
import Notification from "./components/Notification";
import Profile from "./components/profile";
import Search from "./components/search";
import ProfileViewer from "./components/profileViewer";
import Chatting from "./components/chatting";
import ResponsiveDrawer from "./components/drawer";

function Router() {
  return (
    <BrowserRouter>
      <ResponsiveDrawer />
      <Route path="/login" exact component={Login} />
      <Route path="/" exact component={Quote} />
      <Route path="/signup" component={Signup} />
      <Route path="/profile" component={Profile} />
      <Route path="/notifications" component={Notification} />
      <Route path="/search/:what" component={Search} />
      <Route path="/show/:id/profile" component={ProfileViewer} />
      <Route path="/chatting" component={Chatting} />
    </BrowserRouter>
  );
}

export default Router;
