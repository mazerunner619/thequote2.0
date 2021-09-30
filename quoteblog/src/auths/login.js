import {useContext, useState, useEffect } from 'react'
import axios from 'axios'
import {Form, Alert} from 'react-bootstrap'
import { useHistory } from 'react-router';
import {Button} from '@material-ui/core'
import {connect, useDispatch, useSelector} from 'react-redux'
import {getAllPosts} from '../ReduxStore/actions/postActions'
import {Login as LoginAction, getLoggedUser} from '../ReduxStore/actions/userActions'
import {withRouter, Link} from 'react-router-dom'


function Login({LoginAction, loginE}) {
  const hist = useHistory();
  const [user, setUser] = useState({
    username : "",
    password : "",
  });

  function HandleChange(e){
    const {name, value} = e.target;
    setUser( prev => { return{...prev, [name] : value}
    });
  }
  async function HandleClick(e){
    e.preventDefault();
    LoginAction(user,hist);
}

  return (

    <div id="fullPage">
    <Form className="authPage">    
    <h2 style = {{textAlign : "center", padding : "2%" , color : "#b22c5a",  fontFamily :"fantasy", letterSpacing : "3px"}}>Login</h2>
    <hr style={{color : "lightcoral", border : "3px solid lightcoral", borderRadius : "5px", margin : "0 auto", width :  "90%", marginBottom : "2%"}} />
  <Form.Group controlId="formBasicEmail">
    <Form.Label style={{color : "black"}}>enter username</Form.Label>
    <Form.Control type="text" placeholder="Enter username" required name = "username" value={user.username} onChange = {HandleChange} style={{border : "1px solid green"}}/>
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label  style={{color : "black"}}>enter password</Form.Label>
    <Form.Control type="password" placeholder="Password" required name="password" value={user.password} onChange = {HandleChange} style={{border : "1px solid green"}}/>
  </Form.Group>
  <b>{loginE}</b>
<hr/>

  <Button variant="contained" color="secondary" type="submit" onClick = {HandleClick} block style ={{width : "100%"}} >
    Login
  </Button>
<hr/>
don't have an account ? <Link to="/signup">signup</Link>
</Form>
</div>

  );
}

const mapStateToProps = (store) => ({
  loginE : store.userStore.loginE
});

export default connect(mapStateToProps,{
  LoginAction
})(withRouter(Login));



