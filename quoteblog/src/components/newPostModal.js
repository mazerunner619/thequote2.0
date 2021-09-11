import { useState} from 'react';
import {Modal,Alert , Form} from 'react-bootstrap'
import {uploadNewPost} from '../ReduxStore/actions/authActions'
import {getLoggedUser} from '../ReduxStore/actions/userActions'
import {getAllPosts} from '../ReduxStore/actions/postActions'
import {connect} from 'react-redux'
import {Button} from '@material-ui/core'

function NewPostModal({
  uploading,
  uploadError,
  uploaded,
  message,
  show,
  onHide,
  uploadNewPost,
  userid
}) {

  const [ data, setData ] = useState({
    content : "",
    image : null
  });


  function changeForm(e){
const {name, value} = e.target;
    if(name === "image"){
      setData({
        ...data,
        image : e.target.files[0]
      });
    }
    else{
    setData({...data, [name] : value});
    }
  }

  async function handleClick(e){
    console.log(data);
    e.preventDefault(); //prevent refresh / reload of page
    if(data.content){
    const dummyForm = new FormData();
    dummyForm.append('image',data.image);
    dummyForm.append('content',data.content);
    console.log('from frontend => ',data);
    await uploadNewPost(dummyForm, userid);
    await getAllPosts();
    setTimeout(()=>window.location.reload(), 2000);
  }
}

return (
  <div >
  <Modal
    show = {show}
    onHide = {onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
          {
      uploadError && <Alert variant="danger">
        {uploadError}
    </Alert>
    }
    {
      uploaded &&
      <Alert variant="success">
        your post was uploaded successfully
    </Alert>
}
<Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter" style={{color : "#971243"}}>
      <h3 style = {{color : "#b22c5a",  fontFamily :"fantasy", letterSpacing : "2px"}}>
        What's on your mind 
      </h3>
      </Modal.Title>
      <Button className="uploadForm" aria-hidden="true" onClick={onHide}>&times;</Button>
    </Modal.Header>
    <Modal.Body>

  <Form className="" enctype="multipart/form-data" style={{width : "100%"}}>     
  <Form.Group controlId="formBasicEmail">
    <Form.Label style={{color : "#971243"}}>share something...</Form.Label>
    <Form.Label >
</Form.Label>
    <Form.Control as="textarea" rows="5" placeholder="What's on your mind ???" required autocomplete="off" name = "content" value = {data.content} onChange = {changeForm} />
    <Form.Text className="text-muted">
      {!data.content && "you didn't write anything"}
    </Form.Text>
    <hr/>
    <label for="file-upload" class="custom-file-upload-newpost">
     Upload Image
</label>
<input id="file-upload" type="file" name="image" onChange={changeForm}/>
    <Form.Text className="text-muted">
      {!data.image && "you didn't choose an image"}
    </Form.Text>
  </Form.Group>
</Form>

    </Modal.Body>
    <Modal.Footer>
      {!uploading?
<Button variant="contained" color="secondary" onClick = {handleClick}  block style ={{width : "100%"}} >
{
  data.image ? "Upload":"Upload without image"
}

</Button>
     :
<Button variant="contained" color="secondary" disabled>Uploading</Button>  
}
    </Modal.Footer> 
  </Modal>
  </div>
);
}

const mapStateToProps = (store) => ({

  uploading : store.authStore.uploading,
  uploadError : store.authStore.uploadError,
  uploaded : store.authStore.uploaded,

});

export default connect(mapStateToProps,{
  uploadNewPost, getLoggedUser,getAllPosts
})(NewPostModal);

