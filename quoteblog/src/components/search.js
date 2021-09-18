import {useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {Form, Alert,Row, Col, Card, CardGroup} from 'react-bootstrap'
import { useHistory } from 'react-router';
import {Button} from '@material-ui/core'
import {connect} from 'react-redux'
import {getAllPosts} from '../ReduxStore/actions/postActions'
import {Login as LoginAction, getLoggedUser} from '../ReduxStore/actions/userActions'
import {withRouter, Link} from 'react-router-dom'
import {TiUserAdd} from 'react-icons/ti'
import {FcSearch} from 'react-icons/fc'
import $ from 'jquery'


$(function(){
  var a = 0;
  setInterval(()=>{
   if(a==0){
 $("#searching").css("transform", "rotateZ(90deg) scale(2)"); 

 a=1;
   }else{
    $("#searching").css("transform", "rotateZ(-45deg) scale(1)"); 
    a=0; 
  }
},900);
});

function Login({match}) {

  const hist = useHistory();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
      const getData = async() => {
          const {data} = await axios.get(`/search/${match.params.what}`);
          setResult(data);
          setLoading(false);
      }
      getData();
  }, [match.params.what]);

  const resultArr = result.map( res =>   
    <Col>
    <Card>
    <Card.Body>
    <div style={{float : "right",display : "inline", fontSize : "150%", fontFamily : "cursive", cursor : "pointer"}} >
            <TiUserAdd />
            </div>
        <div style={{float : "left"}} className = "mr-2">
    {
                res.profilePicture && res.profilePicture.imageURL ?
                <Card.Img src={res.profilePicture.imageURL} roundedCircle id="post-uploader" alt="profile-picture"/>
                :
                <Card.Img src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png" roundedCircle id="post-uploader" alt="profile-picture"/>
    }
    </div>

        <Card.Title onClick={()=>hist.push(`/show/${res._id}/profile`)} className="text-dark">{res.username}</Card.Title>
        <Card.Text className="text-muted">
        {res.bio}
        </Card.Text >
    </Card.Body>

    </Card>
    </Col>

);
return (
    <div id="fullPage">
      {
        
      loading ?
       <FcSearch id="searching" style={{textAlign:"center", position:"absolute", left : "50%" ,top : "50%", fontSize : "300%", transform : "translate(-50%, -50%)" ,transitionDuration : "1s" }}/>
      :

      (
        
        resultArr.length ?
        <>
          <b style={{textAlign:"center"}}><i>total matches : {result.length}</i></b>
            <Row xs={1} lg={1} className="g-1 ml-auto mr-auto">
          {resultArr}
          </Row>
        </>
        :
        <b style={{textAlign:"center", position:"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}><i>no results found for {match.params.what}</i></b>
      )
}
</div>
  );
}

const mapStateToProps = (store) => ({
  loginE : store.userStore.loginE
});

export default connect(mapStateToProps,{
  LoginAction
})(withRouter(Login));



