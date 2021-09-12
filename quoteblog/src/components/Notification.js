import {Card, Spinner, Alert, Button} from 'react-bootstrap';
import {connect, useDispatch, useSelector} from 'react-redux'
import {MdDelete} from 'react-icons/md'
import {getLoggedUser, getUserNotification} from '../ReduxStore/actions/userActions'
import { useEffect, useState } from 'react';
import {useHistory} from 'react-router'
import {withRouter} from 'react-router-dom'
import {IoIosArrowBack} from 'react-icons/io'
import {deleteNotification,deleteAllNotifications} from '../ReduxStore/actions/authActions'


export default function Notification({
    location
}){

  const history = useHistory();
  const dispatch = useDispatch();
const {loggedUser,loadingN,notifications,errorN} = useSelector( state => state.userStore);

  
    useEffect(()=>{
       dispatch(getUserNotification());      
    }, [dispatch]);
  
    async function deleteN(e,id){
      e.preventDefault();
      await dispatch(deleteNotification(loggedUser._id,id));  
      await dispatch(getUserNotification());  
      await dispatch(getLoggedUser());    
    
    }

    const notiArr = notifications.slice(0).reverse().map( noti =>
      <Card
      bg="info"
      text="light"
      style={{ width: '96vw'}}
      className="ml-auto mr-auto mb-1"
    >          <Card.Body>
        <Card.Text>
          {noti.message}
          <Button variant="outline-danger" className="ml-auto" style={{float : "right" ,fontSize : "130%"}} onClick = {(e) => deleteN(e,noti._id)}><MdDelete /></Button>
        </Card.Text>
      </Card.Body>
    </Card>
    );
    

    return (
        <div id="fullPage">

          <IoIosArrowBack className="m-3" onClick={history.goBack} style={{fontSize : "300%",borderRadius : "50%", border : "1px solid black", color : "#0d47a1", float : "left", boxShadow :" 15px 5px 10px grey"}}/>
          {
            notifications.length>0 && <Button variant="danger" style={{ display : "inline",float : "right"}} className="mr-3 mt-2" onClick = {async() => {
            await dispatch(deleteAllNotifications(loggedUser._id));
          }
          }><MdDelete/> clear all </Button> 
        }

 {errorN && <Alert variant="danger">{errorN}</Alert>}
     
 { loadingN ?
          (<Spinner  style={{textAlign:"center", position:"absolute", left : "50%", top : "50%"}} animation="grow" variant="info"  size="lg"/>)
          :
      (    notifications.length ?
          notiArr
          :
          <b style={{textAlign:"center", position:"absolute", left : "50%", top : "50%", transform : "translate(-50%, -50%)"}}><i>you have no notifications</i></b>
          )

}

        </div>
    )
}
