import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Quote from './collectionPage';
import Navi from './Navi';
import {BrowserRouter, Route} from 'react-router-dom'
import Login from './auths/login'
import Signup from './auths/signup'
import Edit from './editPost'
import { useContext } from 'react';
import AuthContext from './context/authContext';

function Router() {

  const {logged} =  useContext(AuthContext);
  console.log('logged or not : '+logged);

  return (

  <BrowserRouter>
      <Navi />
      
      <Route path = "/" exact>
        <Quote />
  </Route>

  <Route path = "/edit/:id" component = {Edit} />

  <Route path="/login" >
        <Login />
  </Route>

  <Route path="/signup" >
        <Signup  />
  </Route>

    </BrowserRouter>
  );

}

export default Router;



