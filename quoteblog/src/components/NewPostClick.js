import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Form } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function NewPostClick({ newPostHandler }) {
  return (
    <div onMouseDown={newPostHandler}>
      <div className="status">
        <Fab
          color="secondary"
          aria-label="add"
          style={{ background: "#971243" }}
        >
          <AddIcon />
        </Fab>
      </div>

      <Form id="newPost" className="p-2 mt-5 mb-3">
        <FaUserCircle style={{ fontSize: "200%", color: "#971243" }} />
        <div style={{ display: "inline-block" }}>
          <Form.Group controlId="">
            <Form.Control
              type="text"
              placeholder="what's on your mind ???"
              style={{ border: "0", textAlign: "end", width: "100%" }}
            />
          </Form.Group>
        </div>
      </Form>
    </div>
  );
}
