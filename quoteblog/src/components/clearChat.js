import { useState} from 'react';
import {Modal,Alert , Form} from 'react-bootstrap'
import {uploadNewPost} from '../ReduxStore/actions/authActions'
import {getLoggedUser} from '../ReduxStore/actions/userActions'
import {getAllPosts} from '../ReduxStore/actions/postActions'
import {connect, useDispatch,useSelector} from 'react-redux'
import {Button} from '@material-ui/core'


export default function ClearChatModal({
  show,
  onHide,
  onConfirm,
  onCancel
}) {

  // const dispatch = useDispatch();
// const {uploading, uploaded, uploadError} = useSelector( state => state.authStore);


//   async function handleClick(e){
//     console.log(data);
//     e.preventDefault(); //prevent refresh / reload of page
//     if(data.content){
//     const dummyForm = new FormData();
//     dummyForm.append('image',data.image);
//     dummyForm.append('content',data.content);
//     console.log('from frontend => ',data);
//     await dispatch(uploadNewPost(dummyForm, userid));
//      await dispatch(getAllPosts());
//   onHide();
//   }
// }

return (
  <div >

    <Modal
        size="sm"
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >

<Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter" style={{color : "#971243"}}>
      <h3 style = {{color : "#b22c5a",  fontFamily :"fantasy", letterSpacing : "2px"}}>
        Clear Chat !
      </h3>
      </Modal.Title>
      <Button className="uploadForm" aria-hidden="true" onClick={onHide}>&times;</Button>
    </Modal.Header>
    <Modal.Body>
        <p>
            Are you sure ? this will clear clear the chat history at both ends
        </p>
    </Modal.Body>
    <Modal.Footer>
    <Button style={{background : "red"}} onClick = {onConfirm}>Clear</Button>
    <Button className="ml-1" style={{background : "green"}} onClick = {onCancel} >Cancel</Button>
    </Modal.Footer>
  </Modal>
  </div>
);
}
