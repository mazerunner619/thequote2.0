import {Form, Spinner,Container, Row, Col, Card, Image, Popover, OverlayTrigger, Dropdown} from 'react-bootstrap'
import React,{useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Button, Badge} from '@material-ui/core'
import PersonPinIcon from '@material-ui/icons/PersonPin';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useHistory } from 'react-router';
import { acceptRequest, deleteRequest } from '../ReduxStore/actions/authActions';
import {getUser} from '../ReduxStore/actions/userActions'
import { useDispatch, useSelector } from 'react-redux';
import {BiDotsHorizontalRounded} from 'react-icons/bi'
import axios from 'axios';
import  ShowDP from './profilePicOpen'


function TabPanel(props) {
  const { children, value,posts, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width : "100vw",
    padding : "0",
    margin : "0"
  },
}));

export default function ScrollableTabsButtonPrevent({ userid, profile}) {

  const dispatch = useDispatch();
  const hist = useHistory();

  const {findUser, findUserE, findUserS, findUserLoading, loggedUser} = useSelector( state => state.userStore);
    const [POSTS, setPOSTS] = useState([]);
    const [REQS, setREQS  ] = useState([]);
    const [FRI, setFRI] = useState([]);
    const [currimg, setcurrimg] = useState("");

    const [render, setRender] = useState(0);
  useEffect(()=>{
    async function getInfo(){
      const data = await dispatch(getUser(userid));
      setPOSTS(data.posts);
      setFRI(data.friends);
      setREQS(data.receivedRequests);
    }
  getInfo();
  },[dispatch, render]);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

async function handleAcceptRequest(id){
    await dispatch(acceptRequest(userid,id));
    setRender(render === 0 ? 1 : 0)
}

async function handleDeleteRequest(id){
 await dispatch(deleteRequest(userid,id));
 setRender(render === 0 ? 1 : 0)
}

  const requestsArr = REQS.map( res =>   
    <Col>
        <Card bg="dark" text="dark">
    <Card.Body>
 
        <div style={{float : "left"}} className = "mr-2">
    {
                res.from.profilePicture && res.from.profilePicture.imageURL ?
                <Card.Img src={res.from.profilePicture.imageURL} roundedCircle id="post-uploader" alt="profile-picture"/>
                :
                <Card.Img src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png" roundedCircle id="post-uploader" alt="profile-picture"/>
    }
    </div>
    <Card.Title style={{cursor : "pointer"}} onClick={()=>hist.push(`/show/${res.from._id}/profile`)}>{res.from.username}</Card.Title>
        <Card.Text className="text-muted">
        {res.from.bio}
        </Card.Text >
    </Card.Body>
<Row className="ml-0 mr-0">

      <Col className="m-0 p-0">
            <Button  onClick = {(e)=>handleAcceptRequest(res._id)} style={{width : "100%"}} color="secondary" variant="contained">Accept</Button>
      </Col>
      <Col className="m-0 p-0">
            <Button  onClick = {(e)=>handleDeleteRequest(res._id)} style={{width : "100%"}} variant="outlined" color = "success">Delete</Button>
      </Col>
</Row>
    </Card>
    </Col>
  );

  const friendsArr = FRI.map( res =>   
    <Col>
    <Card bg="dark" text="dark">
    <Card.Body>
      {
        profile?
    <Dropdown>
  <Dropdown.Toggle id="dropdown-basic" style = {{display : "inline",background :"#ff4081", width : "40px",height : "40px", borderRadius : "20px", float :"right"}}>
  </Dropdown.Toggle>
  <Dropdown.Menu>

    <Dropdown.Item href="#/action-1" onClick = {async()=>{
      await axios.post(`/user/${loggedUser._id}/unfriend/${res._id}`);
      setRender(render === 0 ? 1 : 0);
    }}  >unfriend</Dropdown.Item>

  </Dropdown.Menu>
</Dropdown>
:
<></>
}

        <div style={{float : "left"}} className = "mr-2">
    {
                res.profilePicture && res.profilePicture.imageURL ?
                <Card.Img src={res.profilePicture.imageURL} roundedCircle id="post-uploader" alt="profile-picture"/>
                :
                <Card.Img src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png" roundedCircle id="post-uploader" alt="profile-picture"/>
    }
    </div>
    <Card.Title style={{cursor : "pointer"}} onClick={()=>hist.push(`/show/${res._id}/profile`)} >{res.username}</Card.Title>
        <Card.Text className="text-muted">
        {res.bio}
        </Card.Text >
    </Card.Body>
    </Card>
    </Col>
  );

  const myPostsArr = POSTS.map(x => 
    <Col sm={4} md={3} lg={3} xs={4} className="p-0">
      <div className="square">
    <img  className="content" 
    onClick = {()=>{
        setcurrimg(x.image.imageURL);
      setEditModal(true);
  }}
  src={x.image.imageURL} alt="profile pic"/>
  </div>
   </Col>
);

const [editModal, setEditModal] = useState(false);



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
       <ShowDP
        show={editModal}
        onHide={() => setEditModal(false)}
        image ={currimg}
      />
{
      findUserLoading ? "loading..." :

<>
      <AppBar position="static">
       
     <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          scrollButtons="off"
          aria-label="scrollable prevent tabs example"
          indicatorColor = "secondary"
          style={{background :"black", borderTop : "1px solid #971243", paddingTop : "3px"}}

        >

  <Tab label="posts" icon={
  <Badge badgeContent={POSTS.length} color="secondary">
  <PersonPinIcon color="secondary"/>
  </Badge>
  } aria-label="posts" />
<Tab label="friends" icon={
  <Badge badgeContent={FRI.length} color="secondary">
  <PeopleAltIcon color="secondary" />
  </Badge>
  } aria-label="connections" />
{
profile &&  <Tab label="requests" icon={
  <Badge badgeContent={REQS.length} color="secondary">
<PersonAddIcon color="secondary"/>
</Badge>
} aria-label="requests" />
}
</Tabs>

      </AppBar>

      <TabPanel value={value} index={0}>
         <Row id="myuploads">
         {
         POSTS.length>0
        ?
        myPostsArr
        :
        <b style={{textAlign:"center" , color : "#b6416c"}}><i>nothing to show</i></b>
      }
          </Row>
          </TabPanel>
          <TabPanel value={value} index={1}>
          <Row xs={1} lg={1} className="g-1 ml-auto mr-auto">
          {FRI.length>0
            ?
            friendsArr
            :
            <b style={{textAlign:"center" , color : "#b6416c"}}><i>nothing to show</i></b>
          }           </Row>
              </TabPanel>
          {
            profile && 
          <TabPanel value={value} index={2}>
          <Row xs={1} lg={1} className="g-1 ml-auto mr-auto">
            {REQS.length>0
            ?
            requestsArr
            :
            <b style={{textAlign:"center" , color : "#b6416c"}}><i>nothing to show</i></b>
          }   
            </Row>
          </TabPanel>
          }
          </>
}
    </div>
  );
}
