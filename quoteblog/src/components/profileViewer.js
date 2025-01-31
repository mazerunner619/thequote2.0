import { useState, useEffect } from "react";
import { Spinner, Container, Row, Col, Image } from "react-bootstrap";
import ShowDP from "./profilePicOpen";
import { getUserPosts } from "../ReduxStore/actions/postActions";
import { getUser } from "../ReduxStore/actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import Menu from "../components/profileMenu";

export default function ProfileViewer({ match }) {
  const dispatch = useDispatch();
  const { findUser, findUserLoading } = useSelector((state) => state.userStore);
  const [currimg, setcurrimg] = useState("");
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    dispatch(getUser(match.params.id));
  }, []);

  return (
    <div id="fullPage" style={{ background: "rgba(0,0,0,0.8)" }}>
      {findUserLoading ? (
        <Spinner
          style={{ position: "absolute", left: "50%", top: "50%" }}
          animation="border"
          variant="info"
          size="lg"
        />
      ) : (
        <>
          <div className="p-2 text-light " style={{ background: "black" }}>
            {findUser &&
            findUser.profilePicture &&
            findUser.profilePicture.imageURL ? (
              <Image
                className="profile-dp"
                src={findUser.profilePicture.imageURL}
                roundedCircle
                alt="profile-pic"
              />
            ) : (
              <Image
                className="profile-dp"
                src="https://tse2.mm.bing.net/th?id=OIP.2YwsAzk2qcqjdw9KRoYjgAHaE8&pid=Api&P=0&w=228&h=153"
                roundedCircle
                alt="profile-pic"
              />
            )}
            <br />
            <br />
            <span>
              <i>{findUser.username}</i>
            </span>
            {"  "}
            <p className="m-1">
              <i className="text-muted">
                {findUser.bio ? findUser.bio : "add a short bio...."}
              </i>
            </p>
          </div>
        </>
      )}

      <Menu userid={match.params.id} profile={false} />
    </div>
  );
}
