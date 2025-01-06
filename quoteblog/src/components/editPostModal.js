import { useState, useContext } from "react";
import { Modal, CloseButton, Alert, Form } from "react-bootstrap";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router";
import { editPost } from "../ReduxStore/actions/authActions";
import { getAllPosts } from "../ReduxStore/actions/postActions";

import { connect, useDispatch, useSelector } from "react-redux";

export default function MyVerticallyCenteredModal({
  show,
  onHide,
  postId,
  postQuote,
}) {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((state) => state.userStore);
  const { editing, edited, editError } = useSelector(
    (state) => state.authStore
  );

  const [quote, setQuote] = useState(postQuote);
  async function HandleClick(e) {
    // console.log(postId);
    e.preventDefault();
    if (quote) {
      await dispatch(editPost(postId, loggedUser._id, { content: quote }));
      await dispatch(getAllPosts());
      onHide();
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
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
            Edit Your Post
          </h3>
        </Modal.Title>

        <Button variant="secondary" aria-hidden="true" onClick={onHide}>
          &times;
        </Button>
      </Modal.Header>
      <Modal.Body style={{ background: "#d9d9d9" }}>
        <Form style={{ width: "100%" }}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label style={{ color: "green" }}>
              your new content ???
            </Form.Label>
            <Form.Control
              style={{ background: "#d9d9d9" }}
              as="textarea"
              rows="5"
              required
              autocomplete="off"
              name="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </Form.Group>
          {!quote.length && <b>content is empty !</b>}
          {editError && <Alert variant="danger">{editError}</Alert>}
          {edited && (
            <Alert variant="success">your post was updated successfully</Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {!editing ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={HandleClick}
            block
            style={{ width: "100%" }}
          >
            Update Post
          </Button>
        ) : (
          <center>
            <Button disabled>Uploading</Button>
          </center>
        )}{" "}
      </Modal.Footer>
    </Modal>
  );
}
