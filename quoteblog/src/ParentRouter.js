import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Quote from "./collectionPage";
import { lazy, Suspense } from "react";
import ResponsiveDrawer from "./components/drawer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const Login = lazy(() => import("./auths/login"));
const Signup = lazy(() => import("./auths/signup"));
const Notification = lazy(() => import("./components/Notification"));
const Profile = lazy(() => import("./components/profile"));
const Search = lazy(() => import("./components/search"));
const ProfileViewer = lazy(() => import("./components/profileViewer"));
const Chatting = lazy(() => import("./components/chatting"));

const fallbackElement = (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    <Spinner variant="light" size="lg" animation="grow" />
  </div>
);
function Router() {
  return (
    <BrowserRouter>
      <ResponsiveDrawer />
      <Suspense fallback={fallbackElement}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/" exact component={Quote} />
          <Route path="/signup" component={Signup} />
          <Route path="/profile" component={Profile} />
          <Route path="/notifications" component={Notification} />
          <Route path="/search/:what" component={Search} />
          <Route path="/show/:id/profile" component={ProfileViewer} />
          <Route path="/chatting" component={Chatting} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default Router;
