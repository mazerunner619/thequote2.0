import React,{useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Form, Card, Dropdown, Image,Alert,Row, Col} from 'react-bootstrap';
import { useHistory } from 'react-router';

import {BsThreeDotsVertical, BsHeartFill, BsHeart} from 'react-icons/bs'
import {FaUserCircle} from 'react-icons/fa'
import { RiSendPlaneLine,RiDeleteBinLine, RiEdit2Fill} from 'react-icons/ri'

import EditPostModal from './editPostModal'
import  {connect, useDispatch} from 'react-redux'
import {getAllPosts} from '../ReduxStore/actions/postActions'
import {deletePost} from '../ReduxStore/actions/authActions'

function Post({
  post, getAllPosts,deletePost, deleting, deleted, deleteError, loggedUser , likeThisPost , liked , likes
 }){

  const dispatch = useDispatch();

    const [editModal, setEditModal] = useState(false);
    const [LIKED, setLIKED] = useState(liked);
    const [LIKES, setLIKES] = useState(likes);

    async function handleClick(e, id){
      console.log('deleting');
      e.preventDefault();
      await deletePost(id, loggedUser._id);
      dispatch(getAllPosts);
    }
  
    return(
        <div className = "grid">
        <Card className="mb-2 mt-3" bg="light" >
          <Card.Header>
            <Row>
              <Col>
              {
                post.uploader.profilePicture && post.uploader.profilePicture.imageURL ?
                <Image src={post.uploader.profilePicture.imageURL} alt="uploader-pic" roundedCircle id="post-uploader"/>
                :
                <Image src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png" roundedCircle id="post-uploader"/>
              }
              
                </Col>
                <Col style={{textAlign : "end"}}>
                <Dropdown>
{
                   loggedUser && (loggedUser._id === post.uploader._id) && 
          <Dropdown.Toggle variant="none" id="dropdown-basic">
            <BsThreeDotsVertical/>
          </Dropdown.Toggle>
}
          <Dropdown.Menu>
            <Dropdown.Item as="button" onClick={()=>setEditModal(true)}><RiEdit2Fill />{' '}Edit Post</Dropdown.Item>
            <Dropdown.Item as="button" onClick = {(e) => handleClick(e, post._id)}><RiDeleteBinLine />{' '}Delete Post</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

                </Col>
            </Row>
            </Card.Header>
        
               <div className="wrapper-image"> 
             { post.image.imageURL ?
             <Card.Img className="card-img" src={post.image.imageURL} alt="poste-image" width="100%" height="100%"/> 
             :
             <Card.Img className="card-img" 
             src="https://source.unsplash.com/random/700x700/?pink,moon,cloud"
            alt="poste-image" width="100%" height="100%"/> 
            
            }
                </div>     
            <Card.Footer>
              {
                LIKED?
              
                      <BsHeartFill style={{fontSize : "150%", color :"red"}} onClick={()=>{
                        setLIKED(!LIKED);
                        setLIKES(p=>p-1);
                        likeThisPost();
                      }}/>
                      :
                      <BsHeart style={{fontSize : "150%"}} onClick={()=>{
                        setLIKED(!LIKED);
                        setLIKES(p=>p+1);
                        likeThisPost();
                      }} 
                      />  
              } 
                      {' '}{LIKES}              
            </Card.Footer>

            <div className="postCaption">
            <blockquote className="blockquote m-0 p-3">
              <p className="caption">
              <b>{post.uploader.username}</b>
              <br/>
              <cite title="Source Title">{post.content}</cite>
              </p> 
           
            {/* <Form className="m-0 p-0" style={{display : "inline-block", width : "90%"}}>
                      <Form.Group controlId="comment">
                    <Form.Control type="text" placeholder = "write a comment" className="comment-bar" style={{border : "0"}} />
                  </Form.Group>
                      </Form>                     */}
                      {/* <RiSendPlaneLine className="m-0 p-0" style={{fontSize : "150%", color : "blue" ,width : "10%"}}/> */}
            </blockquote> 
            </div>
            {/* </Card.ImgOverlay> */}
        
            </Card>

<EditPostModal
        show={editModal}
        onHide={() => setEditModal(false)}
        postId={post._id}
        postQuote = {post.content}
      />  
        </div>
    )
}

const mapStateToProps = (store) =>({

  loggedUser : store.userStore.loggedUser
})

export default connect(mapStateToProps,{
  getAllPosts,deletePost
})(Post);

    
