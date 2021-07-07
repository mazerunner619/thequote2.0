import { useState } from 'react'
import axios from 'axios'
import {Form, Button} from 'react-bootstrap'
import { useHistory } from 'react-router';


export default function Login({match}) {

    const [ quote, setQuote ] = useState("");
    const hist= useHistory();

    function handleChange(e){
        e.preventDefault();
        setQuote(e.target.value);
    }
//looking for post by its users id.....as multiple posts are from same user => we can usiquely identify using its id
    
 function HandleClick(e){
  e.preventDefault();
   axios.post('/edit/'+match.params.id, {quote});
  hist.push('/');
    }

  return (
    <div style = {{  
      backgroundImage: "url(" + "https://images.unsplash.com/photo-1619484537774-7e7b877ae4b5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max" + ")",
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat', 
      width : "100vw",
      height : "100vh"}}>
<Form>

<h2 style = {{textAlign : "center", padding : "2%" , color : "lightcoral",  fontFamily :"fantasy", letterSpacing : "3px"}}>Edit Post</h2>
<hr style={{color : "lightcoral", border : "3px solid lightcoral", borderRadius : "5px", margin : "0 auto", width :  "90%", marginBottom : "2%"}} />
  
    <Form.Group controlId="exampleForm.ControlTextarea1">
    <Form.Label style ={{color :"green"}}>Your content here</Form.Label>
    <Form.Control as="textarea" rows={3} placeholder="your new content here" required cols="100"  autocomplete="off" name = "quote" value = {quote} onChange = {handleChange} style ={{ border : "1px solid green"}}/>
  </Form.Group>
    
    <Button block style={{marginTop : "2%", width : "100%", borderRadius : "20px"}} variant="success" type = "submit" onClick = {HandleClick} >Edit Post</Button>
   
   </Form> 
</div>

  );
}

