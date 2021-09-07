import {useContext, useState } from 'react'
import axios from 'axios'
import {Form, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router';

export default function Profile() {

  const [user, setUser] = useState({
    username : "",
    password : "",
  });
  const hist = useHistory();


  function HandleChange(e){

    const {name, value} = e.target;

    setUser( prev => { return{...prev, [name] : value}
    });

  }
  

  return (


    <div id="fullPage">
      
      <b style={{position : "absolute", top : "50%", left : "50%", transform : "translate(-50%, -50%)"}}><i>working on it</i></b>
</div>

  );
}




