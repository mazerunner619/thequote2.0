import {useState } from 'react'
import axios from 'axios'
import {Form} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {Button} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import {Signup as signupAction} from '../ReduxStore/actions/userActions'
import {connect} from 'react-redux'


 function Signup({
  signupAction,loginE
}) {

  const [user, setUser] = useState({
    username : "",
    password : "",
    confirmpassword : ""
  });

  var hist = useHistory();

  function HandleChange(e){

    const {name, value} = e.target;
    setUser( prev => { return{...prev, [name] : value}
    });
  }


  async function HandleClick(e){
    e.preventDefault();
    signupAction(user,hist);
}

  return (
    <div id="fullPage" >   

    <Form className="authPage">
    <h2 style = {{textAlign : "center", padding : "2%" , color : "#b22c5a",  fontFamily :"fantasy", letterSpacing : "3px"}}>Signup</h2>
<hr style={{color : "lightcoral", border : "3px solid lightcoral", borderRadius : "5px", margin : "0 auto", width :  "90%", marginBottom : "2%"}} />
  <Form.Group controlId="formBasicEmail">
    <Form.Label  style={{color : "black"}}>enter username</Form.Label>
    <Form.Control type="text" placeholder="Enter username" required name = "username" value={user.username} onChange = {HandleChange} style={{border : "1px solid cyan"}}/>
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label  style={{color : "black"}}>enter password</Form.Label>
    <Form.Control type="password" placeholder="Password" required name="password" value={user.password} onChange = {HandleChange} style={{border : "1px solid cyan"}}/>
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label  style={{color : "black"}}>confirm password</Form.Label>
    <Form.Control type="password" placeholder="confirm Password" required name="confirmpassword" value={user.confirmpassword} onChange = {HandleChange} style={{border : "1px solid cyan"}}/>
  </Form.Group>
  <b>{loginE}</b>
<hr/>

<Button variant="contained" color="secondary" type="submit" onClick = {HandleClick} block style ={{width : "100%"}} >
    Signup
  </Button>
  <hr/>
  <center style={{background : "white"}}><p>already have an account ? <a href="/login">login</a></p></center>
</Form>
</div>

  );
}


const mapStateToProps = (store) => ({
  loginE : store.userStore.loginE
});

export default connect(mapStateToProps,{
  signupAction
})(withRouter(Signup));




