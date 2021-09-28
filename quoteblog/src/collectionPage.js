import React,{useEffect, useState} from 'react';
import {Button ,Accordion , Form , Alert,Spinner,Modal,  Row, Col} from 'react-bootstrap';
import { useHistory } from 'react-router';
import {IoIosArrowUp} from 'react-icons/io'
import {FiSend} from 'react-icons/fi'
import {FaUserCircle} from 'react-icons/fa'
import {BsFillPlusCircleFill} from 'react-icons/bs'
import {SiInstagram} from 'react-icons/si'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NewPostModal from './components/newPostModal'
import  {connect, useDispatch, useSelector} from 'react-redux'
import Post from './components/Post'
import {getAllPosts} from './ReduxStore/actions/postActions'
import {getLoggedUser} from './ReduxStore/actions/userActions'
import {likePost} from './ReduxStore/actions/authActions';
// import {createSocket, getonline, getOnline} from './auths/getOnline';
import $ from 'jquery'
import { createSvgIcon } from '@material-ui/core';


export default function Quote(){
const hist = useHistory();
const dispatch = useDispatch();
const {loggedIn, loggedUser} = useSelector( state => state.userStore);
const {allPosts, loading, ERR_loading} = useSelector( state => state.postStore);
const {deleting, deleted, deleteError} = useSelector( state => state.authStore);


const [newPostPage, setNewPostPage] = useState(false);

  useEffect( () => {
     dispatch(getAllPosts());
  console.log('frontEnd rendered',allPosts);
  }, [dispatch]);

  // useEffect(() => {
  //   if(!loggedIn)
  //   hist.push('/login');
  //   // else{
  //   //   createSocket();
  //   //   getonline(loggedUser);
  //   // }
  // }, [loggedIn])

  const newPostHandler = () => {
    if(loggedIn)
    setNewPostPage(true);
    else 
    hist.push('/login');
  }
  const postLiker = (postid)=>{
    dispatch(likePost(postid, loggedUser._id));
  }

const quotesArray = allPosts.slice(0).reverse().map(post => 
<Post 
    likes ={post.likes}
    liked = { (post.likes.indexOf(loggedUser._id) !== -1 )? true:false}
    post = {post}
    likeThisPost = {()=>postLiker(post._id)}
/>);

return (
   < div id="fullPage" style={{minHeight : "100vh"}}>

<NewPostModal 
          show={newPostPage}
          onHide={() => setNewPostPage(false)}
          userid = {loggedUser._id}
/>

<div onMouseDown={newPostHandler} >
  {/* <BsFillPlusCircleFill className = "status"/> */}
  <div className="status">
  <Fab color="secondary" aria-label="add">
  <AddIcon />
</Fab>
</div>

<Form id="newPost" className="p-2 mt-3 mb-3" >
<FaUserCircle style={{fontSize : "200%", color : "pink"}}/>
<div  style={{display : "inline-block"}}>
  <Form.Group controlId="">
    <Form.Control type="text"  placeholder = "what's on your mind ???"  style={{border : "0", textAlign : "end", width : "100%"}}/>
  </Form.Group>
  </div>
</Form>
</div>

{
      deleteError && <Modal variant = "danger" show={deleted}><Modal.Body> {deleteError}</Modal.Body></Modal>
}
    {
      deleted &&
      <Modal show={deleted} centered><Modal.Body style={{background : "white", textAlign : "center", color : "#971243", boxShadow : "5px 5px 20px black",fontWeight : "bolder"}}> <i>your post was deleted successfully</i></Modal.Body></Modal>
  
}

{
  allPosts.length === 0?
  <Spinner variant="dark" size="lg"  animation="grow" style={{position : "absolute",left : "50%", top : "80%" }}/>
   :
  quotesArray
}

  <a href="#top" style={{ textDecoration: "none", color : '#971243', marginLeft : "45%", fontSize : "200%"}}><IoIosArrowUp /></a> 


  <footer className="text-center text-white"  >
  <div className="footer">
    ©mazerunner619{'  '}<a href="https://www.instagram.com/happiest_depressed_1/" style={{color : 'white', fontSize : "20px"}}>{' '}{' '}<SiInstagram /> </a>
  </div>
</footer>

  </div>
      );
}