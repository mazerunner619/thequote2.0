import {useContext, useState } from 'react'
import axios from 'axios'
import {Form, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import AuthContext from '../context/authContext';
import { useHistory } from 'react-router';


export default function Login() {

  const [user, setUser] = useState({
    username : "",
    password : "",
  });
  const hist = useHistory();

  const {getLogged, getLoggedUser} = useContext(AuthContext);

  function HandleChange(e){

    const {name, value} = e.target;

    setUser( prev => { return{...prev, [name] : value}
    });

  }
  async function HandleClick(e){

    e.preventDefault();
    if(user.username && user.password){
    // post to login route
    const resp = await axios.post('/user/login', user);
    if(resp.data === 'wrong password' || resp.data === 'wrong username')
    alert(resp.data);
    else {
      getLogged();
      getLoggedUser();
      hist.push('/');
    }
    }
    else{
      alert('fill all the fields')
  }

}

  return (

    <div style={{  
      backgroundImage: "url(" + "https://images.unsplash.com/photo-1619484537774-7e7b877ae4b5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max" + ")",
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat', 
      width : "100vw",
      height : "100vh"
    }}>
    
    <Form>      
    <h2 style = {{textAlign : "center", padding : "2%" , color : "lightcoral",  fontFamily :"fantasy", letterSpacing : "3px"}}>Login</h2>
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
<hr/>
  <Button variant="success" type="submit" onClick = {HandleClick} block style ={{width : "100%"}} >
    Login
  </Button>

<hr/>
<left>
<h4>create an account</h4>
</left>

<LinkContainer to = "/signup">
<Button variant="info" >
    Signup
  </Button>
 
  </LinkContainer>
</Form>
</div>

  );
}




