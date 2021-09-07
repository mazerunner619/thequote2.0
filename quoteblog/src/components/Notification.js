import {Card, Spinner, Alert, Button} from 'react-bootstrap';
import {connect} from 'react-redux'
import {MdDelete} from 'react-icons/md'
import {getUserNotification} from '../ReduxStore/actions/userActions'
import { useEffect, useState } from 'react';
import {useHistory} from 'react-router'
import {withRouter} from 'react-router-dom'
import {IoIosArrowBack} from 'react-icons/io'
import {deleteNotification,deleteAllNotifications} from '../ReduxStore/actions/authActions'


function Notification({
    location,
    loadingN,
    notifications,
    errorN,
    getUserNotification ,
    deleteNotification,
    deleteAllNotifications,
}){

  const history = useHistory();
  
    const [all, setAll] = useState([]);
    const [rerender, setRender] = useState(0);
    useEffect(()=>{
      async function getInfo(){
        const data = await getUserNotification();
        setAll(data);
      }
      getInfo()
    }, [rerender]);
  
    async function deleteN(e,id){
      e.preventDefault();
      await deleteNotification(location.state.userId,id);
      setRender(rerender === 0 ? 1 : 0);
    }
    

    return (
        <div id="fullPage">

          <IoIosArrowBack className="m-2" onClick={history.goBack} style={{fontSize : "300%",borderRadius : "50%", border : "1px solid black", color : "#0d47a1", float : "left", boxShadow :" 15px 5px 10px grey"}}/>
          {
            all.length>0 && <Button variant="danger" style={{ display : "inline",float : "right"}} className="mr-3 mt-2" onClick = {async() => {
            await deleteAllNotifications(location.state.userId);
            setRender(rerender === 0 ? 1:0);
          }
          }><MdDelete/> clear all </Button> 
        }

 {errorN && <Alert variant="danger">{errorN}</Alert>}
            {loadingN 
            ?
            <Spinner style={{ position:"absolute", left : "50%", top : "50%"}} animation="border" variant="info"  size="lg"/>
            :
            (all.length>0 ?
            all.slice(0).reverse().map( noti =>
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
                )
                :
                <b style={{position : "absolute", top : "50%", left : "50%", transform : "translate(-50%, -50%)"}}><i>you have no notifications</i></b>
            )
          }
     {/* } */}

        </div>
    )
}

const mapStateToProps = (store) => ({
       loadingN : store.userStore.loadingN,
       notifications : store.userStore.notifications,
       errorN : store.userStore.errorN,
  });
  
  export default connect(mapStateToProps,{
      getUserNotification,deleteNotification,deleteAllNotifications
    })(Notification);
  