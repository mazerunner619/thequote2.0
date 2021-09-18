import {useState, useEffect } from 'react'
import {Spinner,Container, Row, Col, Image} from 'react-bootstrap'
import  ShowDP from './profilePicOpen'
import {getUserPosts} from '../ReduxStore/actions/postActions'
import {getUser} from '../ReduxStore/actions/userActions'
import {useSelector, useDispatch} from 'react-redux'
import $ from 'jquery'

export default function ProfileViewer({match}){

  const dispatch = useDispatch();
  const {findUser, findUserE, findUserS, findUserLoading} = useSelector( state => state.userStore);
  const {userPosts, userPostsL, userPostsS} = useSelector( state => state.postStore);

  const [currimg, setcurrimg] = useState("");


  useEffect(()=>{
    dispatch(getUser(match.params.id));
    dispatch(getUserPosts(match.params.id));
  },[]);
  
   const [editModal, setEditModal] = useState(false);

  const myPostsArr = userPosts.map(x => 
  <Col sm={4} md={3} lg={3} xs={4} className="p-0">

    <div className="square">
  <img  className="content" onClick = {()=>{
      setcurrimg(x.image.imageURL);
    setEditModal(true);
}}
src={x.image.imageURL} alt="profile pic"/>
</div>
 </Col>
    );
  return (

    <div id="fullPage" style={{background : "black"}}>

      {
        findUserLoading ?
        <Spinner style={{ position:"absolute", left : "50%", top : "50%"}} animation="border" variant="info"  size="lg"/>
        :
        <>
           <div 
           className="p-2 text-light "
           style={{background : "black"}}>

       {
findUser && findUser.profilePicture && findUser.profilePicture.imageURL ? 
<Image onClick = {()=>{
  setcurrimg(findUser.profilePicture.imageURL);
  setEditModal(true);
}} className="profile-dp" src={findUser.profilePicture.imageURL} roundedCircle alt="profile-pic"/>
:
<Image onClick = {()=>{
}} className="profile-dp" src="https://tse2.mm.bing.net/th?id=OIP.2YwsAzk2qcqjdw9KRoYjgAHaE8&pid=Api&P=0&w=228&h=153" roundedCircle alt="profile-pic"/>
}
    <br/><br/><span ><i>{findUser.username}</i></span>{'  '}
    <p className="m-1"><i className="text-muted">{findUser.bio ? findUser.bio : "add a short bio...."}</i></p>
</div>

<br />

<p style={{ border : "1px solid #97124368", textAlign : "center", color : "white"}}><i>posts</i></p>
<div className="m-2">
<Container fluid>
<Row>
  { userPostsS &&
      myPostsArr.length ?
          myPostsArr
          :
          <b style={{textAlign:"center"}}><i>no recent posts by {findUser.username}</i></b>

}
</Row>
</Container>
</div>
</>
}





      <ShowDP
        show={editModal}
        onHide={() => setEditModal(false)}
        image ={currimg}
      />
      

      </div>

  );
}





