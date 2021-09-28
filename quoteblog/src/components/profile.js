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
  },[dispatch]);
  
  const [editModal, setEditModal] = useState(false);
  return (
    <div id="fullPage" style={{background : "rgba(0,0,0,0.8)"}}>
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
}<br/>
<span >
  <i>{loggedUser.username}</i></span>{'  '}
  <div style={{float :"right", cursor : "pointer",  color : "white"}} ><i onClick = {()=>setProfile(true)}>update profile{' '}<FiEdit3 /></i></div>
  <p style={{overflowWrap : "break-word"}} className="m-1"><i className="text-muted">{loggedUser.bio ? loggedUser.bio : "add a short bio...."}</i></p>
</div>
</>
}

{
  !loading && loggedUser && loggedUser.posts &&
  <Menu userid = {loggedUser._id} profile = {true}/>
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





