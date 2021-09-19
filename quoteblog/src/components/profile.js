import {useContext, useState, useEffect } from 'react'
import axios from 'axios'
import {Form, Spinner,Container, Row, Col, Card, Image} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import {Button} from '@material-ui/core';
import { useHistory } from 'react-router';
import  ShowDP from './profilePicOpen'
import {FiEdit3} from 'react-icons/fi'
import {getMyPosts} from '../ReduxStore/actions/postActions'
import {getLoggedUser} from '../ReduxStore/actions/userActions'
import {connect,useSelector, useDispatch} from 'react-redux'
import $ from 'jquery'
import EditProfile from './editProfile'
import Menu from '../components/profileMenu'

$(function(){
  setTimeout(()=>
  $("#myuploads").slideDown(),
  4000);
});

export default function Profile(){

  const dispatch = useDispatch();
  const {loggedUser,loading} = useSelector( state => state.userStore);
  const currUserPosts = useSelector( state => state.postStore.myPosts);
  // const loadingPosts = useSelector( state => state.postStore.loading);
  // const userPostsS = useSelector( state => state.postStore.userPostsS);
  

  const [editProfileModal, setProfile] = useState(false);
  const [currimg, setcurrimg] = useState("");


  useEffect(()=>{
    dispatch(getLoggedUser());
    dispatch(getMyPosts());
    console.log('from frontend user',loggedUser);
    console.log('from frontend posts',currUserPosts);
  },[dispatch]);
  
  const [editModal, setEditModal] = useState(false);

//   const myPostsArr = currUserPosts.map(x => 
//   <Col sm={4} md={3} lg={3} xs={4} className="p-0">

//     <div className="square">
//   <img  className="content" onClick = {()=>{
//       setcurrimg(x.image.imageURL);
//     setEditModal(true);
// }}
// src={x.image.imageURL} alt="profile pic"/>
// </div>
//  </Col>
//     );
  return (
    <div id="fullPage" style={{background : "black"}}>
      {
        loading ?
        <Spinner style={{ position:"absolute", left : "50%", top : "50%"}} animation="border" variant="info"  size="lg"/>
        :
        <>
           <div 
           className="p-2 text-light "
           style={{background : "black"}}>

         {
loggedUser && loggedUser.profilePicture && loggedUser.profilePicture.imageURL ? 
<Image onClick = {()=>{
  setcurrimg(loggedUser.profilePicture.imageURL);
  setEditModal(true);
}} className="profile-dp" src={loggedUser.profilePicture.imageURL} roundedCircle alt="profile-pic"/>
:
<Image onClick = {()=>{
}} className="profile-dp" src="https://tse2.mm.bing.net/th?id=OIP.2YwsAzk2qcqjdw9KRoYjgAHaE8&pid=Api&P=0&w=228&h=153" roundedCircle alt="profile-pic"/>
}

<br/><br/><span ><i>{loggedUser.username}</i></span>{'  '}
    <p className="m-1"><i className="text-muted">{loggedUser.bio ? loggedUser.bio : "add a short bio...."}</i></p>


    <div style={{float :"right", cursor : "pointer"}} ><i onClick = {()=>setProfile(true)}>EDIT {' '}<FiEdit3 /></i></div>

</div>
</>
}
<br />

{/* 
<p style={{ border : "1px solid #97124368", textAlign : "center", color : "white"}}><i>posts</i></p>
<div className="m-2">
<Container fluid>
<Row id="myuploads" style={{display : "none"}}>
  {  userPostsS && 
  myPostsArr.length ?
          myPostsArr
          :
          <b style={{textAlign:"center"}}><i>you have no recent posts</i></b>
}
</Row>
</Container>
</div> */}

{
  !loading && loggedUser && loggedUser.posts &&
  <Menu posts = {currUserPosts} requests={loggedUser.receivedRequests} friends = {loggedUser.friends} userid = {loggedUser._id} profile = {true}/>
}

      <ShowDP
        show={editModal}
        onHide={() => setEditModal(false)}
        image ={currimg}
      />
      
      
<EditProfile
        show={editProfileModal}
        onHide={() => setProfile(false)}
        im = {loggedUser}
      />  
      </div>

  );
}





