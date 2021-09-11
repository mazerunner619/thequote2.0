import { useEffect, useState } from 'react';
import {Modal,Col, CloseButton, InputGroup , Image, Row, FormControl, Alert ,Form} from 'react-bootstrap'
import {Button} from '@material-ui/core'
import axios from 'axios';
import { useHistory } from 'react-router';
import {editPost} from '../ReduxStore/actions/authActions';
import {connect,useSelector , useDispatch} from 'react-redux'
import {updateProfileInfo,getLoggedUser} from '../ReduxStore/actions/userActions'

export default function MyVerticallyCenteredModal({
  show, onHide, im
}) {

  const dispatch = useDispatch();
  const {updateP,updatePS,updatePE, loggedUser} = useSelector( state => state.userStore);

  const [ username, setUserName ] = useState(loggedUser.username);
  const [ bio, setBio ] = useState(loggedUser.bio);
  const [ dp, setDp ] = useState(null);
  const [ERR, setERR]=useState("");

async function HandleClick(e){
  e.preventDefault();
  if((!username && !dp && !bio) || (username===im.username && bio===im.bio && !dp ) ){
    setERR("no changes to save ");
    setTimeout(()=>setERR(""), 3000);
    return;
  }
const dummyForm = new FormData();
dummyForm.append("image",dp);
dummyForm.append("bio",bio);
dummyForm.append("username",username);
 await dispatch(updateProfileInfo(dummyForm));
   await dispatch(getLoggedUser());
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
      Edit your Profile
      </h3>
      </Modal.Title>
      <Button variant="secondary" aria-hidden="true" onClick={onHide}>&times;</Button>

    </Modal.Header>
    <Modal.Body>

     <Form style={{width : "100%"}}>  
     <Row>

 <Col sm={12} md={4} lg={4} xs={12} className="mb-2" >
    <div className="container">
    {
im && im.profilePicture && im.profilePicture.imageURL ? 
<Image width = "150px" height = "150px" onClick = {()=>{
}}  src={im.profilePicture.imageURL} roundedCircle alt="profile-pic"/>
:
<Image width = "150px" height = "150px" onClick = {()=>{
}}  src="https://tse2.mm.bing.net/th?id=OIP.2YwsAzk2qcqjdw9KRoYjgAHaE8&pid=Api&P=0&w=228&h=153" roundedCircle alt="profile-pic"/>
}
  <div class="overlay">
  <label for="file-upload" class="custom-file-upload">
     Upload
</label>
<input id="file-upload" type="file" name="image" onChange={(e) => setDp(e.target.files[0])}/>
  </div>
</div>
 </Col>

          <Col sm={12} md={8} lg={8} xs={12} className="justifyContent-center">

          <Form.Group controlId="formBasicEmail">
    <Form.Label style={{color : "black"}}>username</Form.Label>
    <Form.Control type="text" placeholder="add a username" required value={username} onChange={(e)=>setUserName(e.target.value)} style={{border : "1px solid green"}}/>
    <Form.Text className="text-muted">
      {updatePE}{ERR}
    </Form.Text>
  </Form.Group>

  <Form.Group controlId="formBasicEmail">
    <Form.Label style={{color : "black"}}>add a bio</Form.Label>
    <Form.Control type="text" placeholder="add a bio" required  value={bio} onChange = {(e)=>setBio(e.target.value)} style={{border : "1px solid green"}}/>
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>

          </Col>
     </Row>
   </Form> 
   
    </Modal.Body>
    <Modal.Footer>
      {
        !updateP?
      <Button variant="contained" color="secondary" onClick = {HandleClick} block style ={{width : "100%"}} >Save</Button>
     :
     <Button variant="contained" color="secondary" disabled >Updating</Button>
      }
     </Modal.Footer>
  </Modal>
);

  }


  