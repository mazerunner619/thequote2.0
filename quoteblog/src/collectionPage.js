import React, { useEffect, useState } from "react";
import { Spinner, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { IoIosArrowUp } from "react-icons/io";
import NewPostModal from "./components/newPostModal";
import { useDispatch, useSelector } from "react-redux";
import Post from "./components/Post";
import { getAllPosts } from "./ReduxStore/actions/postActions";
import { likePost } from "./ReduxStore/actions/authActions";
import { Button } from "@material-ui/core";
import { LIMIT } from "./ReduxStore/reducers/postsReducer";
import Footer from "./components/Footer";
import NewPostClick from "./components/NewPostClick";
export default function Quote() {
  const hist = useHistory();
  const dispatch = useDispatch();
  const { loggedIn, loggedUser } = useSelector((state) => state.userStore);
  const { allPosts, page, totalCount, loading, error } = useSelector(
    (state) => state.postStore
  );
  const { deleted, deleteError } = useSelector((state) => state.authStore);

  const [newPostPage, setNewPostPage] = useState(false);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  function loadMore() {
    if (Number(page) === Math.ceil(totalCount / LIMIT)) return;
    dispatch(getAllPosts(Number(page) + 1, totalCount));
  }
  const newPostHandler = () => {
    if (loggedIn) setNewPostPage(true);
    else hist.push("/login");
  };
  const postLiker = (postid) => {
    dispatch(likePost(postid, loggedUser._id));
  };

  const quotesArray = allPosts.map((post) => (
    <Post
      key={post._id}
      likes={post.likes}
      liked={post.likes.indexOf(loggedUser._id) !== -1}
      loggedUser={loggedUser}
      post={post}
      likeThisPost={() => postLiker(post._id)}
    />
  ));

  if (error)
    return (
      <p
        style={{
          textAlign: "center",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {error}
      </p>
    );

  return (
    <div id="fullPage" style={{ minHeight: "100vh" }}>
      <NewPostModal
        show={newPostPage}
        onHide={() => setNewPostPage(false)}
        userid={loggedUser._id}
      />

      <NewPostClick newPostHandler={newPostHandler} />

      {deleteError && (
        <Modal variant="danger" show={deleted}>
          <Modal.Body> {deleteError}</Modal.Body>
        </Modal>
      )}

      {error && <p> {error}</p>}

      {deleted && (
        <Modal show={deleted} centered>
          <Modal.Body
            style={{
              background: "white",
              textAlign: "center",
              color: "#971243",
              boxShadow: "5px 5px 20px black",
              fontWeight: "bolder",
            }}
          >
            {" "}
            <i>your post was deleted successfully</i>
          </Modal.Body>
        </Modal>
      )}

      {quotesArray}

      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spinner variant="light" size="lg" animation="grow" />
        </div>
      )}
      {!loading && (
        <p style={{ display: "flex", justifyContent: "center" }}>
          {Number(page) === Math.ceil(totalCount / Number(LIMIT)) ? (
            <Button variant="text" color="default">
              that's all for now!
            </Button>
          ) : (
            <Button variant="text" color="inherit" onClick={loadMore}>
              more ...
            </Button>
          )}
          <br />
        </p>
      )}
      <a
        href="#top"
        style={{
          textDecoration: "none",
          color: "#971243",
          // marginLeft: "45%",
          fontSize: "200%",
        }}
      >
        <IoIosArrowUp />
      </a>

      <Footer />
    </div>
  );
}
