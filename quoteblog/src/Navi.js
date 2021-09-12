import './App.css';
import {Navbar, Nav, Spinner} from 'react-bootstrap'
import { FaUserCircle , FaQuoteRight, FaQuoteLeft } from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import {BsChatQuoteFill} from 'react-icons/bs';
import {MdNotificationsActive} from 'react-icons/md'
import { withRouter } from 'react-router-dom';
import $ from 'jquery'



//redux
import  {connect} from 'react-redux'
import {getLoggedUser, Logout} from './ReduxStore/actions/userActions'

import { useEffect } from 'react';
import {useHistory} from 'react-router'

$(function(){
  setTimeout(()=>$("#topper").fadeToggle(),1000 );
  setTimeout(()=>$("#topper").fadeToggle(),1500 );
  setTimeout(()=>$("#topper").fadeToggle(),1700 );

});


function Navi({
  loggedUser,
  loggedIn,
  loading,
  error ,
  getLoggedUser, //from connect
  Logout
}){
  
  


  const hist = useHistory();

    useEffect( ()=>{
      getLoggedUser()
  }, [loggedIn]);
  
  async function getLoggedOut(){
    Logout(hist);
  }

  return (

    <Navbar collapseOnSelect expand="lg"  variant="dark" style= {{padding : "2%", background :"#971243"}}>
  
  <Navbar.Brand href="/" id="topper">
  < FaQuoteLeft />{' '}The Quote{' '}<BsChatQuoteFill/> {' '}<FaQuoteRight />
  </Navbar.Brand>

  <Navbar.Toggle aria-controls="responsive-navbar-nav" />

  <Navbar.Collapse id="responsive-navbar-nav">

 <Nav style = {{marginLeft : "auto"}}>
{
  loggedIn && loggedUser &&
  <LinkContainer to={{
    pathname : "/notifications",
    state : {userId : loggedUser._id}
  }}>
  <Nav.Link ><MdNotificationsActive style={{fontSize : "150%"}} />{loggedUser.notifications.length}</Nav.Link> 
 </LinkContainer>
}

{loggedIn && 
<>
{
  loggedUser?
  <LinkContainer to="/profile">
  <Nav.Link ><FaUserCircle style={{fontSize : "150%"}}/>{' '+loggedUser.username}</Nav.Link> 
  </LinkContainer>
  :
  <Spinner animation="border" role="status">
  <span className="sr-only"></span>
  </Spinner>
}

</>
}

  {!loggedIn && 
  <>
  {
    !loading &&
    <>
  <LinkContainer to ="/login">
      <Nav.Link>Login
      </Nav.Link>
  </LinkContainer>

    <LinkContainer to ="/signup">
        <Nav.Link>Signup
        </Nav.Link>
    </LinkContainer>
    </>
 }
    </>
  }

    {loggedIn && 
        <Nav.Link onClick = {getLoggedOut}>Logout
        </Nav.Link>
}
    
    </Nav>

  </Navbar.Collapse>

</Navbar>

  );
}

const mapStateToProps = (store) => ({
  loggedUser : store.userStore.loggedUser,
  loggedIn : store.userStore.loggedIn,
  loading : store.userStore.loading,
  error : store.userStore.error
});

export default connect(mapStateToProps,{getLoggedUser,Logout})(withRouter(Navi));



