import { useState , useContext} from 'react';
import {Modal, CloseButton , Image, Alert ,Form} from 'react-bootstrap'
import {Button} from '@material-ui/core'
import axios from 'axios';
import { useHistory } from 'react-router';
import {editPost} from '../ReduxStore/actions/authActions';
import {connect} from 'react-redux'

export default function ShowDP({
  show, onHide, image
}) {

return (
  <Modal
  show = {show}
  onHide = {onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >     
    <Modal.Body className="p-0 m-0">
        <Image src={image} rounded alt = "profile-pic" width="100%" height="100%" />
    </Modal.Body>
  </Modal>
);

  }

  
  