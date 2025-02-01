import { Modal, Alert, Form } from "react-bootstrap";
import { Button } from "@material-ui/core";

export default function ClearChatModal({ onHide, onConfirm }) {
  return (
    <div>
      <p>Are you sure ? this will clear the chat history at both ends</p>
      <Button style={{ background: "red" }} onClick={onConfirm}>
        Clear
      </Button>
      <Button
        className="ml-1"
        style={{ background: "green", marginLeft: "5px" }}
        onClick={onHide}
      >
        Cancel
      </Button>
    </div>
  );
}
