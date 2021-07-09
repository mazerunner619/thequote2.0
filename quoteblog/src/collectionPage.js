import React,{useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Button,Accordion,Carousel, Form, Card} from 'react-bootstrap';
import { SiInstagram } from "react-icons/si";
import AuthContext from './context/authContext';
import { useHistory } from 'react-router';
import {BsFillChatSquareQuoteFill} from 'react-icons/bs'
import {IoIosArrowUp} from 'react-icons/io'



import { RiDeleteBinLine, RiEdit2Fill} from 'react-icons/ri'
import {Link} from 'react-router-dom'

function Quote(){

  const {logged, loggedUser} = useContext(AuthContext);

  const hist = useHistory();

  const [quotes, setQuotes] = useState([{
    quote : "",
    author : "",
    bg : ""
  }]);


  const [ quote, setQuote ] = useState("");

  useEffect( () => {
    const fetchData = async () => {
        const {data} = await axios.get('/disp');
        setQuotes(data);
    }
    fetchData();
  });

  function handleChange(e){
    setQuote(e.target.value);
  }

  
  async function deletePost(id){
    await axios.get('/delete/'+id);
    alert('your post was deleted successfully !')
  }

  function check(){
    if(logged === false){
      hist.push('/login');
    }
  }

function handleClick(e){

  var pos = quote;

  if(pos[0] !== "\""){
pos = "\""+pos;
}
if(pos[pos.length] !== "\""){
pos = pos+"\"";
}

if(quote){
// https://mernquoteappserver.herokuapp.com/post

  e.preventDefault(); //prevent refresh / reload of page
  axios.post('/post', {quote : pos, author : loggedUser.username }); //quote.author
  
  setQuote({
    quote : "",
    author : "",
  });
}
else{
  alert('you can\'t post an empty content !');
}
}

const quotesArray = quotes.slice(0).reverse().map((quot => 
<div className = "grid">

<Card className="grid1" >
  <Card.Header>

        <i>@_{quot.author}</i>

     
    </Card.Header>

        <Card.Img className="card-img" src="https://fsb.zobj.net/crop.php?r=D4sr-PS5vNxOUQ9J63U4miy8wsc1D9TivO7azZGAyABpmHn1g-qZyBjOhJ_oz7WrHqo0bpDXflxQkHZpkEoHQjbSycHy5mNqqCLNb8QnTy49VllypyZLrriIS7DDpbr-auU50QY2xng7Zfqn" alt="quote-image" width="100%" height="100%"  />
        
        <Card.ImgOverlay>
    <Card.Body className="card-body" >
    <blockquote className="blockquote mb-0">
      <p>
      {quot.quote}
      </p> 
      <footer className="blockquote-footer" >
      <cite title="Source Title" style = {{color : "yellow"}}>{quot.author}</cite>
    </footer>
    </blockquote>
    </Card.Body> 
    </Card.ImgOverlay>
    </Card>

    <div className = "grid2">
    { logged && quot.author === loggedUser.username && 
    <>
    
    <Button block style={{ height : "100%", float : "left", marginRight : "1%"}} variant="danger" onClick = {() => deletePost(quot._id)}><RiDeleteBinLine /></Button>
    
    <Link to = {{
      pathname : '/edit/'+quot._id, 
      }}>

     <Button block style={{  height : "100%" , marginRight : "1%"}} variant="info"> <RiEdit2Fill /> </Button> 

   </Link> 
 
    
    </>
}
    </div>

</div>

    ));

return (


   < div>
     
     <img alt="background" className="body-img" src="https://images.unsplash.com/photo-1619484537774-7e7b877ae4b5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max"/>

<Carousel fade className="carousel-main" nextLabel="" prevLabel="" nextIcon="" prevIcon="">

  {quotes.slice(0).reverse().map((quot => 
<Carousel.Item interval={3500}>
  
<div>
        <Card className="carousel-card">
        <Card.Img className="carousel-img" src="https://source.unsplash.com/random/cute" alt="quote-image" width="100%" height="100%" />
        <Card.ImgOverlay>
        <Card.Body className="card-body" >

        <blockquote className="blockquote mb-0">
          <p>
          {quot.quote}
          </p> 

          <footer className="blockquote-footer" >
          <cite title="Source Title"  style = {{color : "yellow"}}>{quot.author}</cite>
        </footer>

        </blockquote>

        </Card.Body>

      
        </Card.ImgOverlay>
        </Card>

    </div>
    </Carousel.Item>)
    )}

</Carousel>

<Accordion  >
  <Card className = "accor-card" style = {{marginTop : "2%", borderRadius : "20px"}}>
  <Card.Header style = {{ padding : "0",margin : "0",width : "100%", borderRadius : "20px"}}>
      <Accordion.Toggle as={Button} eventKey="0" className="Accor" onClick = {check} style={{margin : "0", padding : "2%", backgroundColor : "lightcoral",  width : "100%", borderRadius : "20px"}}>
        have a thought ? <BsFillChatSquareQuoteFill />  
      </Accordion.Toggle>
    </Card.Header>
      
    <Accordion.Collapse eventKey="0">
    <Form style= {{margin : "2% auto"}}>    
    <Form.Group controlId="exampleForm.ControlTextarea1">
    <Form.Label style ={{color : "seagreen"}}>Your content here</Form.Label>
    <Form.Control as="textarea" rows={3} placeholder="your content here" required cols="100"  autocomplete="off" name = "quote" value = {quote.quote} onChange ={handleChange}style = {{ border  : "1px solid seagreen"}} />
  </Form.Group>
    
    <Button block style={{marginTop : "2%", width : "100%", borderRadius : "20px"}} variant="success" type = "submit" onClick = {handleClick} >Post</Button>
   
   </Form> 

      </Accordion.Collapse>
      </Card>
 
</Accordion>


<hr style={{color : "green"}}/>
<blockquote className="blockquote mb-1" style={{textAlign : "center",padding :'0%', color : "green", fontSize : "150"} } >
  <p>POSTS</p>
</blockquote>

<hr style={{ color : "green"}}/>

      {quotesArray}

<a href="#top" style={{ textDecoration: "none", color : 'black', marginLeft : "45%", fontSize : "20px"}}><IoIosArrowUp /></a>

   </div>
      );
}

export default Quote;