import React, { useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import {InputBase, IconButton, Badge} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import './App.css';
import {Navbar, Nav, Spinner} from 'react-bootstrap'
import { FaUserCircle , FaQuoteRight, FaQuoteLeft } from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import {BsChatQuoteFill} from 'react-icons/bs';
import {MdNotificationsActive} from 'react-icons/md'
import { withRouter } from 'react-router-dom';

import NotificationsIcon from '@material-ui/icons/Notifications';


import $ from 'jquery'


//redux
import  {connect, useDispatch, useSelector} from 'react-redux'
import {getLoggedUser, Logout} from './ReduxStore/actions/userActions'
import { useEffect } from 'react';
import {useHistory} from 'react-router'

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.25),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.35),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    marginTop : '1%' ,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

$(function(){
  setTimeout(()=>$("#quote-logo").animate({marginLeft : '50%'}),800 );
  setTimeout(()=>$("#quote-logo").animate({marginLeft : '5px'}),900 );
});


export default function Navi(){

  const classes = useStyles();
  const dispatch = useDispatch();
  const {loggedUser,loggedIn, loading,error} = useSelector( state => state.userStore);
  const [search, setSearch] = useState("");
  
  const hist = useHistory();

    useEffect( ()=>{
      dispatch(getLoggedUser());
  }, [dispatch]);
  
  async function getLoggedOut(){
    await dispatch(Logout(hist));
  }

  const handleSearch = (search) => {
    hist.push(`/search/${search}`);
  }

  return (

    <Navbar collapseOnSelect expand="lg"  variant="dark" style= {{padding : "2%", background :"#971243"}}>
  <Navbar.Brand href="/" id="quote-logo">
  < FaQuoteLeft />{' '}The Quote{' '}<BsChatQuoteFill/> {' '}<FaQuoteRight />
  </Navbar.Brand>

  <Navbar.Toggle aria-controls="responsive-navbar-nav" className="ml-auto"/>

  <Navbar.Collapse id="responsive-navbar-nav">

 <Nav style = {{marginLeft : "auto"}}>
{
  loggedIn && loggedUser &&
  <>
    
    <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="search..."
              onChange={(e)=>setSearch(e.target.value)}
              onKeyDown = {(e) => search.length && e.key === "Enter" && handleSearch(e.target.value)}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
  </div>

  <LinkContainer to={{
    pathname : "/notifications",
    state : {userId : loggedUser._id}
  }}>
  <Nav.Link >
          <Badge badgeContent={loggedUser.notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
  </Nav.Link> 
 </LinkContainer>
 </>
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




