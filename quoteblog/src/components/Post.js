import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Form, Card, Dropdown, Image, Alert, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router";
import { alpha, makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Avatar, Badge } from "@material-ui/core";

import { BsThreeDotsVertical, BsHeartFill, BsHeart } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { RiSendPlaneLine, RiDeleteBinLine, RiEdit2Fill } from "react-icons/ri";

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

function Post({
  post,
  getAllPosts,
  deletePost,
  deleting,
  deleted,
  deleteError,
  loggedUser,
  likeThisPost,
  liked,
  likes,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const hist = useHistory();

  const [editModal, setEditModal] = useState(false);
  const [LIKES, setLIKES] = useState(likes.length);
  const [LIKED, setLIKED] = useState(liked);

  async function handleClick(e, id) {
    // console.log('deleting');
    e.preventDefault();
    await deletePost(id, loggedUser._id);
    dispatch(getAllPosts);
  }

  function fomatDate(date) {
    let newDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return newDate;
  }

  return (
    <div className="grid">
      <Card className="mt-2" style={{ background: "rgba(0,0,0,0.4)" }}>
        <Card.Header>
          <Row>
            <Col>
              {post.uploader.profilePicture &&
              post.uploader.profilePicture.imageURL ? (
                <Avatar
                  alt="user-pic"
                  src={post.uploader.profilePicture.imageURL}
                />
              ) : (
                <Avatar
                  alt="user-pic"
                  src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png"
                />
              )}
              {/* {post.createdAt.toLocaleDateString("en-US",{weekday : "long", year : "long", month : "short", day : "2-digit"})} */}{" "}
              {fomatDate(post.createdAt)}
            </Col>
            <Col style={{ textAlign: "end" }}>
              <Dropdown>
                {loggedUser && loggedUser._id === post.uploader._id && (
                  <Dropdown.Toggle variant="none" id="dropdown-basic">
                    <BsThreeDotsVertical />
                  </Dropdown.Toggle>
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
              src="https://source.unsplash.com/random/700x700/?pink,moon,cloud"
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

          {/*
                       {
                        likes.length && liked && <p style={{display : "inline"}}>{`You and ${likes.length} others`}</p>
                      }
                      {
                        !likes.length && liked && <p style={{display : "inline"}}>{`You`}</p>
                      }
                      {
                        likes.length === 1 && !liked && <p style={{display : "inline"}}>{`${likes[0].username}`}</p>
                      }

                      {
                        likes.length > 1 && !liked && <p style={{display : "inline"}}>{`${likes[0].username} ans ${likes.length - 1} others`}</p>
                      } 
                      */}
        </Card.Footer>
        <div className="postCaption">
          <blockquote className="blockquote m-0 p-3">
            <p className="caption">
              <b
                style={{
                  cursor: "pointer",
                  color: "black",
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

        {/* </Card.ImgOverlay> */}
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
