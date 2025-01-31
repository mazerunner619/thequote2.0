import React, { useState } from "react";
import { Card, Dropdown, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";

import { BsHeartFill, BsHeart } from "react-icons/bs";
import { RiDeleteBinLine, RiEdit2Fill } from "react-icons/ri";

import EditPostModal from "./editPostModal";
import { connect, useDispatch } from "react-redux";
import { getAllPosts } from "../ReduxStore/actions/postActions";
import { deletePost } from "../ReduxStore/actions/authActions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function Post({ post, loggedUser, likeThisPost, liked, likes }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const hist = useHistory();

  const [editModal, setEditModal] = useState(false);
  const [LIKES, setLIKES] = useState(likes.length);
  const [LIKED, setLIKED] = useState(liked);

  async function handleClick(e, id) {
    e.preventDefault();
    console.log(id, "deleting post");
    await dispatch(deletePost(id, loggedUser._id));
    await dispatch(getAllPosts());
  }

  function fomatDate(date) {
    let newDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
    return newDate;
  }

  return (
    <div className="grid">
      <Card className="mt-2" style={{ background: "black", color: "white" }}>
        <Card.Header>
          <Row>
            <Col>
              {post.uploader.profilePicture &&
              post.uploader.profilePicture.imageURL ? (
                <Avatar
                  alt="user-pic"
                  src={post.uploader.profilePicture.imageURL}
                  style={{ border: "1px solid white" }}
                />
              ) : (
                <Avatar
                  alt="user-pic"
                  src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png"
                  style={{ border: "1px solid white" }}
                />
              )}
              {fomatDate(post.createdAt)}
            </Col>
            <Col style={{ textAlign: "end" }}>
              <Dropdown>
                {loggedUser && loggedUser._id === post.uploader._id && (
                  <Dropdown.Toggle
                    variant="none"
                    style={{ color: "white" }}
                    id="dropdown-basic"
                  ></Dropdown.Toggle>
                )}
                <Dropdown.Menu>
                  <Dropdown.Item as="button" onClick={() => setEditModal(true)}>
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
              src="https://images.unsplash.com/photo-1521840891849-69baa8035cc7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsbHxlbnwwfHwwfHx8MA%3D%3D"
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
          {LIKES > 0 ? LIKES : ""}
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
                onClick={() => hist.push(`/show/${post.uploader._id}/profile`)}
              >
                {post.uploader.username}
              </b>
              <br />
              <cite title="Source Title">{post.content}</cite>
            </p>
          </blockquote>
        </div>
        <br />
      </Card>

      <EditPostModal
        show={editModal}
        onHide={() => setEditModal(false)}
        postId={post._id}
        postQuote={post.content}
      />
    </div>
  );
}

const mapStateToProps = (store) => ({
  loggedUser: store.userStore.loggedUser,
});

export default connect(mapStateToProps, {
  getAllPosts,
  deletePost,
})(Post);
