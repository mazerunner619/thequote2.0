import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Quote from './collectionPage';
import Navi from './Navi';
import {BrowserRouter, Route} from 'react-router-dom'
import Login from './auths/login'
import Signup from './auths/signup'
import Notification from './components/Notification'
import Profile from './components/profile'

function Router() {


  return (
  <BrowserRouter>
      <Navi />
      <Route path = "/" exact component={Quote} />
      <Route path="/login" component = {Login}/>
      <Route path="/signup" component={Signup} />
      <Route path="/profile" component={Profile} />
      <Route path="/notifications" component={Notification} />
      

  </BrowserRouter>
  );

}

export default Router;



