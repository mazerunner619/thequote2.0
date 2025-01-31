import { useState, useEffect } from "react";
import { Spinner, Image } from "react-bootstrap";
import ShowDP from "./profilePicOpen";
import { FiEdit3 } from "react-icons/fi";
import { getLoggedUser } from "../ReduxStore/actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import $ from "jquery";
import EditProfile from "./editProfile";
import Menu from "../components/profileMenu";
import { DEFAULT_PROFILE_PICTURE } from "../ReduxStore/reducers/userReducer";

$(function () {
  setTimeout(() => $("#myuploads").slideDown(), 4000);
});

export default function Profile() {
  const dispatch = useDispatch();
  const { loggedUser, loading } = useSelector((state) => state.userStore);
  const [editProfileModal, setProfile] = useState(false);
  const [currimg, setcurrimg] = useState("");

  useEffect(() => {
    dispatch(getLoggedUser());
  }, [dispatch]);

  const [editModal, setEditModal] = useState(false);

  return (
    <div id="fullPage" style={{ background: "rgba(0,0,0,0.8)" }}>
      {loading ? (
        <Spinner
          style={{ position: "absolute", left: "50%", top: "50%" }}
          animation="border"
          variant="info"
          size="lg"
        />
      ) : (
        <>
          <div className="p-2 text-light " style={{ background: "black" }}>
            {loggedUser &&
            loggedUser.profilePicture &&
            loggedUser.profilePicture.imageURL ? (
              <Image
                className="profile-dp"
                src={loggedUser.profilePicture.imageURL}
                roundedCircle
                alt="profile-pic"
              />
            ) : (
              <Image
                className="profile-dp"
                src={DEFAULT_PROFILE_PICTURE}
                roundedCircle
                alt="profile-pic"
              />
            )}
            <br />
            <span>
              <i>{loggedUser.username}</i>
            </span>
            {"  "}
            <div style={{ float: "right", cursor: "pointer", color: "white" }}>
              <i onClick={() => setProfile(true)}>
                update profile <FiEdit3 />
              </i>
            </div>
            <p style={{ overflowWrap: "break-word" }} className="m-1">
              <i className="text-muted">
                {loggedUser.bio ? loggedUser.bio : "add a short bio...."}
              </i>
            </p>
          </div>
        </>
      )}

      {!loading && loggedUser && loggedUser.posts && (
        <Menu userid={loggedUser._id} profile={true} />
      )}

      <EditProfile
        show={editProfileModal}
        onHide={() => setProfile(false)}
        im={loggedUser}
      />
    </div>
  );
}
