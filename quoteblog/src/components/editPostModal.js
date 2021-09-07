import { useState , useContext} from 'react';
import {Modal, CloseButton , Alert ,Form} from 'react-bootstrap'
import {Button} from '@material-ui/core'
import axios from 'axios';
import { useHistory } from 'react-router';
import {editPost} from '../ReduxStore/actions/authActions';
import {connect} from 'react-redux'

function MyVerticallyCenteredModal({
  show, onHide, postId, postQuote, loggedUser, editing, edited, editError, editPost
}) {

  const [ quote, setQuote ] = useState(postQuote);
async function HandleClick(e){
console.log(postId);
e.preventDefault();
if(quote){
 await editPost(postId, loggedUser._id, {content : quote});
  window.location.reload();
}
else{
  alert('you can\'t post an empty content !');
}
}

return (
  <Modal
  show = {show}
  onHide = {onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header>

    <Modal.Title id="contained-modal-title-vcenter" style={{color : "#971243"}}>
      <h3 style = {{color : "#b22c5a",  fontFamily :"fantasy", letterSpacing : "2px"}}>
      Edit Your Post
      </h3>
      </Modal.Title>

      <Button variant="secondary" aria-hidden="true" onClick={onHide}>&times;</Button>

    </Modal.Header>
    <Modal.Body>
     <Form style={{width : "100%"}}>   
    <Form.Group controlId="exampleForm.ControlTextarea1">
    <Form.Label style ={{color :"green"}}>
      your new content ???
    </Form.Label>
    <Form.Control as="textarea" rows="5"  required   autocomplete="off" name = "quote" value = {quote} onChange = {(e)=>setQuote(e.target.value)} />
  </Form.Group>   
  
   </Form> 
   
    </Modal.Body>
    <Modal.Footer>
    {!editing?
      <Button variant="contained" color="secondary" onClick = {HandleClick} block style ={{width : "100%"}} >Update Post</Button>
      :
      <center>
    <Button disabled>Uploading</Button>
    </center>
      }    </Modal.Footer>
  </Modal>
);

  }


  const mapStateToProps = (store) => ({

    editing : store.authStore.editing,
    edited : store.authStore.edited,
    editError : store.authStore.editError,
    loggedUser : store.userStore.loggedUser
  
  });
  
  export default connect(mapStateToProps,{
    editPost, 
  })(MyVerticallyCenteredModal);
  
  