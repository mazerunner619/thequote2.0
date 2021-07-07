import './App.css';
import {Navbar, Nav, Spinner} from 'react-bootstrap'
import { useContext } from 'react';
import AuthContext from './context/authContext';
import { FaUserCircle , FaQuoteRight, FaQuoteLeft } from 'react-icons/fa';

import {BsChatQuoteFill} from 'react-icons/bs';


import axios from 'axios';

export default function Navi() {

  const {logged, getLogged,loggedUser,  getLoggedUser} = useContext(AuthContext);

  async function logout(e){
    e.preventDefault();
    await axios.get('/user/logout');
    getLogged();
    getLoggedUser();
  }


  return (

    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" style= {{padding : "2%"}}>
  
  <Navbar.Brand href="/" >
  < FaQuoteLeft />{' '}The Quote{' '}<BsChatQuoteFill /> {' '}<FaQuoteRight />
  </Navbar.Brand>

  <Navbar.Toggle aria-controls="responsive-navbar-nav" />

  <Navbar.Collapse id="responsive-navbar-nav">

 <Nav  style = {{marginLeft : "auto"}}>


{logged === true && 
<>
{
  loggedUser ?
  <Nav.Link style = {{textDecoration : "underline"}}><FaUserCircle/>{' '+loggedUser.username}</Nav.Link> 
  :
  <Spinner animation="border" role="status">
  <span className="sr-only"></span>
  </Spinner>
}

</>
}

  {logged === false && 
  <>

    <Nav.Link eventKey={2} href="/login">Login
    </Nav.Link>
  
    <Nav.Link eventKey={2} href="/signup">Signup
    </Nav.Link>
    </>
  }



    {logged === true && 
    <Nav.Link eventKey={2} href="/logout" onClick = {logout}>Logout
    </Nav.Link>
}
    
    </Nav>

  </Navbar.Collapse>

</Navbar>


  );
}




