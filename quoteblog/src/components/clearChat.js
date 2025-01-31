import { useState } from "react";
import { Modal, Alert, Form } from "react-bootstrap";
import { uploadNewPost } from "../ReduxStore/actions/authActions";
import { getLoggedUser } from "../ReduxStore/actions/userActions";
import { getAllPosts } from "../ReduxStore/actions/postActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";

export default function ClearChatModal({ show, onHide, onConfirm, onCancel }) {
  return (
    <div>
      <Modal
        size="sm"
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >
        <Modal.Header>
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ color: "#971243" }}
          >
            <h3
              style={{
                color: "#b22c5a",
                fontFamily: "fantasy",
                letterSpacing: "2px",
              }}
            >
              Clear Chat !
            </h3>
          </Modal.Title>
          <Button className="uploadForm" aria-hidden="true" onClick={onHide}>
            &times;
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure ? this will clear the chat history at both ends</p>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ background: "red" }} onClick={onConfirm}>
            Clear
          </Button>
          <Button
            className="ml-1"
            style={{ background: "green", marginLeft: "5px" }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
