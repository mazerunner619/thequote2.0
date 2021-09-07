import React,{useEffect, useState} from 'react';
import axios from 'axios';
import {Button ,Accordion , Form , Alert,Spinner,Modal,  Row, Col} from 'react-bootstrap';
import { useHistory } from 'react-router';
import {IoIosArrowUp} from 'react-icons/io'
import {FiSend} from 'react-icons/fi'
import {FaUserCircle} from 'react-icons/fa'
import {BsFillPlusCircleFill} from 'react-icons/bs'

import NewPostModal from './components/newPostModal'

import  {connect} from 'react-redux'
import Post from './components/Post'
import {getAllPosts} from './ReduxStore/actions/postActions'
import {getLoggedUser} from './ReduxStore/actions/userActions'
import {likePost} from './ReduxStore/actions/authActions';
function Quote({
  deleting,
  deleted,
  deleteError,
  allPosts,
  loading,
  ERR_loading,
  getAllPosts,
  getLoggedUser,
  logged,
  loggedUser,
  likePost
}){

const hist = useHistory();


const [newPostPage, setNewPostPage] = useState(false);

  const [quotes, setQuotes] = useState([]);

  useEffect( () => {
    getAllPosts();
    getLoggedUser();
    setQuotes(allPosts);
    console.log(quotes);
  }, [allPosts.length]);


  const newPostHandler = () => {
    if(logged)
    setNewPostPage(true);
    else 
    hist.push('/login');
  }

  const postLiker = (postid)=>{
    likePost(postid, loggedUser._id);
  }

const quotesArray = quotes.slice(0).reverse().map(post => 
<Post 
    likes ={post.likes.length}
    liked = { (post.likes.indexOf(loggedUser._id) !== -1 )? true:false}
    post = {post}
    likeThisPost = {()=>postLiker(post._id)}
/>);

return (
   < div id="fullPage" style={{minHeight : "100vh"}}>

<NewPostModal 
          show={newPostPage}
          onHide={() => setNewPostPage(false)}
          message="hey thr"
          userid = {loggedUser._id}
/>

<div onMouseDown={newPostHandler}>
  <BsFillPlusCircleFill className = "status"/>
<Form id="newPost" className="p-2 mt-3 mb-3" >
<FaUserCircle style={{fontSize : "200%", color : "pink"}}/>
<div  style={{display : "inline-block"}}>
  <Form.Group controlId="">
    <Form.Control type="text"  placeholder = "what's on your mind ???"  style={{border : "0", textAlign : "end", width : "100%"}}/>
  </Form.Group>
  </div>
</Form>
</div>

      {/* <img alt="background" className="body-img" 
src="https://images.unsplash.com/photo-1604155669054-d41e0814c359?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1268&q=80"      /> */}


{
      deleteError && <Modal variant = "danger" show={deleted}><Modal.Body> {deleteError}</Modal.Body></Modal>
}
    {
      deleted &&
      <Modal show={deleted} centered><Modal.Body style={{background : "white", textAlign : "center", color : "#971243", boxShadow : "5px 5px 20px black",fontWeight : "bolder"}}> <i>your post was deleted successfully</i></Modal.Body></Modal>
  
}

{
  loading?
  <Spinner variant="dark" size="lg"  animation="grow" style={{position : "absolute",left : "50%", top : "80%" }}/>
   :
  quotesArray
}

  <a href="#top" style={{ textDecoration: "none", color : '#971243', marginLeft : "45%", fontSize : "200%"}}><IoIosArrowUp /></a> 

  </div>
      );
}

//state retrieve
const mapStateToProps = (store) => ({
  allPosts : store.postStore.allPosts,
  loading : store.postStore.loading,
  ERR_loading : store.postStore.error,
  logged : store.userStore.loggedIn,
  loggedUser : store.userStore.loggedUser,
  deleting : store.authStore.deleting,
  deleted : store.authStore.deleted,
  deleteError : store.authStore.deleteError,
});


export default connect(mapStateToProps,{
  getAllPosts,
  getLoggedUser,
  likePost
})(Quote);