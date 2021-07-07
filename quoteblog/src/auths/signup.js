import {useState } from 'react'
import axios from 'axios'
import {Form, Button} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

export default function Signup(props) {

  const [user, setUser] = useState({
    username : "",
    password : "",
    password1 : ""
  });

  var hist = useHistory();

  function HandleChange(e){

    const {name, value} = e.target;

    setUser( prev => { return{...prev, [name] : value}
    });
  }

  async function HandleClick(e){
    e.preventDefault();

    if(user.password1 !== user.password){
      alert('passwords do not match !')
    }
    else if(user.username && user.password){
    // post to login route
    const resp = await axios.post('/user/signup', user);
    
    alert(resp.data);
    if(resp.data === 'registered successfully'){
        hist.push('/login')
    }
    }
    else{
      alert('fill all the fields');
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
    }} >
    

    <Form>
    <h2 style = {{textAlign : "center", padding : "2%" , color : "lightcoral",  fontFamily :"fantasy", letterSpacing : "3px"}}>Signup</h2>
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
    <Form.Control type="password" placeholder="confirm Password" required name="password1" value={user.password1} onChange = {HandleChange} style={{border : "1px solid cyan"}}/>
  </Form.Group>

<hr/>

  <Button variant="info" type="submit" onClick = {HandleClick}>
    Signup
  </Button>

</Form>
</div>

  );
}




