import {Form, Spinner,Container, Row, Col, Card, Image} from 'react-bootstrap'
import React from 'react';
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));


export default function ScrollableTabsButtonPrevent({posts, friends, requests, userid, profile}) {

  const dispatch = useDispatch();
  const hist = useHistory();

  const {findUser, findUserE, findUserS, findUserLoading} = useSelector( state => state.userStore);
  //   const [POSTS, setPOSTS] = React.useState([]);
  //   const [REQS, setREQS] = React.useState([]);
  //   const [FRI, setFRI] = React.useState([]);

  // React.useEffect(()=>{
  //  dispatch(getUser(userid));
  // },[]);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

async function handleAcceptRequest(id){
    // e.preventDefault();
    const data = await dispatch(acceptRequest(userid,id));
    window.location.reload();
}

async function handleDeleteRequest(id){
  // e.preventDefault();
  await dispatch(deleteRequest(userid,id));
  window.location.reload();
}

  const requestsArr = (requests !== null)?(
  requests.map( res =>   
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
  )
  )
  :
  [];
  const friendsArr = friends.map( res =>   
    <Col>
    <Card bg="dark" text="dark">

    <Card.Body>
 
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

  const myPostsArr = posts.map(x => 
    <Col sm={4} md={3} lg={3} xs={4} className="p-0">
      <div className="square">
    <img  className="content" 
//     onClick = {()=>{
//         setcurrimg(x.image.imageURL);
//       setEditModal(true);
//   }}
  src={x.image.imageURL} alt="profile pic"/>
  </div>
   </Col>
);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
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
  <Badge badgeContent={posts.length} color="secondary">
  <PersonPinIcon color="secondary"/>
  </Badge>
  } aria-label="posts" />
<Tab label="friends" icon={
  <Badge badgeContent={friends.length} color="secondary">
  <PeopleAltIcon color="secondary" />
  </Badge>
  } aria-label="connections" />
{
profile &&  <Tab label="requests" icon={
  <Badge badgeContent={requests.length} color="secondary">
<PersonAddIcon color="secondary"/>
</Badge>
} aria-label="requests" />
}
</Tabs>

      </AppBar>

      <TabPanel value={value} index={0}>
         <Row id="myuploads">
         {posts.length>0
        ?
        myPostsArr
        :
        <b style={{textAlign:"center" , color : "#b6416c"}}><i>nothing to show</i></b>
      }   
          </Row>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Row xs={1} lg={1} className="g-1 ml-auto mr-auto">
      {friends.length>0
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
        {requests.length>0
        ?
        requestsArr
        :
        <b style={{textAlign:"center" , color : "#b6416c"}}><i>nothing to show</i></b>
      }   
        </Row>
      </TabPanel>
}
      
    </div>
  );
}
