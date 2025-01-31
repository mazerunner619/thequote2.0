import { useState } from "react";
import { Modal, Dropdown, Card, Row, Col } from "react-bootstrap";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import { RiDeleteBinLine, RiEdit2Fill } from "react-icons/ri";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_PROFILE_PICTURE } from "../ReduxStore/reducers/userReducer";
import EditPostModal from "./editPostModal";
import { getAllPosts } from "../ReduxStore/actions/postActions";
import { deletePost } from "../ReduxStore/actions/authActions";
import { Avatar } from "@material-ui/core";
import { DEFAULT_POST_IMG } from "../ReduxStore/reducers/postsReducer";

export default function ShowDP({
  show,
  onHide,
  image,
  post,
  uploader,
  likeThisPost,
}) {
  const dispatch = useDispatch();
  const hist = useHistory();
  const { loggedUser } = useSelector((state) => state.userStore);

  const [editModal, setEditModal] = useState(false);
  // const [LIKES, setLIKES] = useState(post.likes.length);
  const [LIKES, setLIKES] = useState(0);
  const [LIKED, setLIKED] = useState(() => {
    return true;
    // return post.likes.indexOf(loggedUser._id) !== -1;
  });

  async function handleClick(e, id) {
    e.preventDefault();
    await dispatch(deletePost(id, loggedUser._id));
    onHide();
  }

  function fomatDate(date) {
    let newDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
    return newDate;
  }

  if (!post || !uploader) return <></>;

  return (
    <Modal
      style={{ zIndex: "9999" }}
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      fullscreen={true}
    >
      <Modal.Body className="p-0 m-0" style={{ backgroundColor: "black" }}>
        <Card
          className="mt-2"
          style={{
            background: "black",
            color: "white",
            width: "fit-content",
            height: "100%",
            margin: "0 auto",
          }}
        >
          <Card.Header>
            <Row>
              <Col>
                {uploader.profilePicture && uploader.profilePicture.imageURL ? (
                  <Avatar
                    alt="user-pic"
                    src={uploader.profilePicture.imageURL}
                    style={{ border: "1px solid white" }}
                  />
                ) : (
                  <Avatar
                    alt="user-pic"
                    src={DEFAULT_PROFILE_PICTURE}
                    style={{ border: "1px solid white" }}
                  />
                )}

                {fomatDate(post.createdAt)}

              </Col>
              
              <Col style={{ textAlign: "end" }}>
                <Dropdown>
                  {loggedUser && loggedUser._id === uploader._id && (
                    <Dropdown.Toggle
                      variant="none"
                      style={{ color: "white" }}
                      id="dropdown-basic"
                    ></Dropdown.Toggle>
                  )}
                  <Dropdown.Menu>
                    <Dropdown.Item
                      as="button"
                      onClick={() => setEditModal(true)}
                    >
                      <RiEdit2Fill /> Edit Post
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={(e) => handleClick(e, post._id)}
                    >
                      <RiDeleteBinLine /> Delete Post
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Card.Header>

          <div className="wrapper-image">
            {post.image.imageURL ? (
              <Card.Img
                className="card-img"
                src={post.image.imageURL}
                alt="poste-image"
                width="100%"
                height="100%"
              />
            ) : (
              <Card.Img
                className="card-img"
                src={DEFAULT_POST_IMG}
                alt="poste-image"
                width="100%"
                height="100%"
              />
            )}
          </div>
          <Card.Footer>
            {LIKED ? (
              <>
                <BsHeartFill
                  style={{ fontSize: "150%", color: "red" }}
                  onClick={() => {
                    setLIKED((x) => !x);
                    setLIKES((p) => p - 1);
                    likeThisPost();
                  }}
                />
              </>
            ) : (
              <BsHeart
                style={{ fontSize: "150%" }}
                onClick={() => {
                  setLIKED((x) => !x);
                  setLIKES((p) => p + 1);
                  likeThisPost();
                }}
              />
            )}
            {LIKES > 0 ? ` ${LIKES}` : ""}
          </Card.Footer>
          <div className="postCaption">
            <blockquote className="blockquote m-0 p-3">
              <p className="caption">
                <b
                  style={{
                    cursor: "pointer",
                    color: "white",
                    textDecoration: "underline",
                  }}
                  onClick={() => hist.push(`/show/${uploader._id}/profile`)}
                >
                  {uploader.username}
                </b>
                <br />
                <cite title="Source Title">{post.content}</cite>
              </p>
            </blockquote>
          </div>
          <br />
        </Card>
      </Modal.Body>

      <EditPostModal
        show={editModal}
        onHide={() => setEditModal(false)}
        postId={post._id}
        postQuote={post.content}
      />
      <Button onClick={onHide}>Close</Button>
    </Modal>
  );
}
