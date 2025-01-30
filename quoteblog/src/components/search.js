import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import { useHistory } from "react-router";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { sendRequest } from "../ReduxStore/actions/authActions";
import { TiUserAdd } from "react-icons/ti";
import { FcSearch } from "react-icons/fc";

import $ from "jquery";

$(function () {
  var a = 0;
  setInterval(() => {
    if (a === 0) {
      $("#searching").css("transform", "rotateZ(90deg) scale(2)");

      a = 1;
    } else {
      $("#searching").css("transform", "rotateZ(-45deg) scale(1)");
      a = 0;
    }
  }, 900);
});

export default function Search({ match }) {
  const hist = useHistory();
  const [result, setResult] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { loggedUser, loggedIn } = useSelector((state) => state.userStore);
  const [render, setRender] = useState(0);
  useEffect(() => {
    if (!loggedIn) hist.push("/login");
    setLoading(true);
    const getData = async () => {
      const searchFor = match.params.what ? match.params.what : "";
      const { data } = await axios.get(
        `/search/${searchFor}/${loggedUser._id}`
      );
      setResult(data.searching);
      setAll(data.all);
      setLoading(false);
    };
    getData();
  }, [match.params.what, render]);

  const sendFriendRequest = async (e, id) => {
    await dispatch(sendRequest(loggedUser._id, id));
    setRender((prev) => 1 - prev);
  };

  const resultArr = result.map((res) => (
    <Col>
      <Card>
        <Card.Body>
          <div style={{ float: "right", display: "inline", fontSize: "150%" }}>
            {res.Sent ? (
              <>
                <Button disabled>pending...</Button>
              </>
            ) : (
              !res.Friends && (
                <TiUserAdd
                  style={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "120%",
                  }}
                  onClick={(e) => sendFriendRequest(e, res._id)}
                />
              )
            )}
          </div>
          <div style={{ float: "left" }} className="mr-2">
            {res.profilePicture && res.profilePicture.imageURL ? (
              <Card.Img
                src={res.profilePicture.imageURL}
                roundedCircle
                id="post-uploader"
                alt="profile-picture"
              />
            ) : (
              <Card.Img
                src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png"
                roundedCircle
                id="post-uploader"
                alt="profile-picture"
              />
            )}
          </div>
          <Card.Title
            style={{ cursor: "pointer" }}
            onClick={() => hist.push(`/show/${res._id}/profile`)}
            className="text-dark"
          >
            {res.username}
          </Card.Title>
          <Card.Text className="text-muted">{res.bio}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ));

  const allArr = all.map((res) => (
    <Col>
      <Card>
        <Card.Body>
          <div
            style={{
              float: "right",
              display: "inline",
              fontSize: "150%",
              fontFamily: "cursive",
              cursor: "pointer",
            }}
          >
            {res.Sent ? (
              <>
                <Button disabled>pending...</Button>
              </>
            ) : (
              !res.Friends && (
                <TiUserAdd
                  style={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "120%",
                  }}
                  onClick={(e) => sendFriendRequest(e, res._id)}
                />
              )
            )}
          </div>
          <div style={{ float: "left" }} className="mr-2">
            {res.profilePicture && res.profilePicture.imageURL ? (
              <Card.Img
                src={res.profilePicture.imageURL}
                roundedCircle
                id="post-uploader"
                alt="profile-picture"
              />
            ) : (
              <Card.Img
                src="https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png"
                roundedCircle
                id="post-uploader"
                alt="profile-picture"
              />
            )}
          </div>
          <Card.Title
            style={{ cursor: "pointer" }}
            onClick={() => hist.push(`/show/${res._id}/profile`)}
            className="text-dark"
          >
            {res.username}
          </Card.Title>
          <Card.Text className="text-muted">{res.bio}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ));

  return (
    <div id="fullPage">
      {loading ? (
        <FcSearch
          id="searching"
          style={{
            textAlign: "center",
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: "300%",
            transform: "translate(-50%, -50%)",
            transitionDuration: "1s",
          }}
        />
      ) : resultArr.length ? (
        <>
          <b style={{ textAlign: "center" }}>
            <i>total matches : {result.length}</i>
          </b>
          <Row xs={1} lg={1} className="g-1 ml-auto mr-auto">
            {resultArr}
          </Row>
        </>
      ) : (
        <b style={{ textAlign: "center" }}>
          <i>no results found for {match.params.what}</i>
        </b>
      )}

      <p
        style={{
          border: "1px solid #97124368",
          fontSize: "200%",
          textAlign: "center",
          color: "black",
          fontFamily: "fantasy",
        }}
      >
        <i>Discover...</i>
      </p>

      <Row xs={1} lg={1} className="g-1 ml-auto mr-auto">
        {allArr}
      </Row>
    </div>
  );
}
