import React,{useEffect, useState} from 'react';
import {Form ,Spinner,Modal} from 'react-bootstrap';
import { useHistory } from 'react-router';
import {IoIosArrowUp} from 'react-icons/io'
import {FaUserCircle} from 'react-icons/fa'
import {SiInstagram} from 'react-icons/si'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NewPostModal from './components/newPostModal'
import  {useDispatch, useSelector} from 'react-redux'
import Post from './components/Post'
import {getAllPosts} from './ReduxStore/actions/postActions'
import {likePost} from './ReduxStore/actions/authActions';


export default function Quote(){
const hist = useHistory();
const dispatch = useDispatch();
const {loggedIn, loggedUser} = useSelector( state => state.userStore);
const {allPosts} = useSelector( state => state.postStore);
const {deleted, deleteError} = useSelector( state => state.authStore);


const [newPostPage, setNewPostPage] = useState(false);

  useEffect( () => {
     dispatch(getAllPosts());
  }, [dispatch]);

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
    liked = {post.likes.indexOf(loggedUser._id) !== -1}
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
  <Fab color="secondary" aria-label="add" style = {{background : "#971243"}}>
  <AddIcon />
</Fab>
</div>

<Form id="newPost" className="p-2 mt-3 mb-3" >
<FaUserCircle style={{fontSize : "200%", color : "#971243"}}/>
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