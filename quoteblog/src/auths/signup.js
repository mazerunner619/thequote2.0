import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { Signup as signupAction } from "../ReduxStore/actions/userActions";
import { connect, useDispatch } from "react-redux";
import { AiFillEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import { LOGIN_ERROR } from "../ReduxStore/actionTypes";

function Signup({ signupAction, loginE }) {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch({ type: LOGIN_ERROR, payload: null });
    };
  }, []);

  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmpassword: "",
  });

  const [visibility, setVisibility] = useState(false);

  var hist = useHistory();

  function HandleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function HandleClick(e) {
    e.preventDefault();
    if (user.password !== user.confirmpassword) {
      dispatch({ type: LOGIN_ERROR, payload: "passwords do not match" });
      return;
    }
    signupAction(user, hist);
  }

  return (
    <div id="fullPage">
      <Form className="authPage">
        <h2
          style={{
            textAlign: "center",
            padding: "2%",
            color: "#b22c5a",
            fontFamily: "fantasy",
            letterSpacing: "3px",
          }}
        >
          Signup
        </h2>
        <hr
          style={{
            color: "lightcoral",
            border: "3px solid lightcoral",
            borderRadius: "5px",
            margin: "0 auto",
            width: "90%",
            marginBottom: "2%",
          }}
        />
        <Form.Group controlId="formBasicEmail">
          <Form.Label style={{ color: "black" }}>enter username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            required
            name="username"
            value={user.username}
            onChange={HandleChange}
            style={{ border: "1px solid cyan" }}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label style={{ color: "black" }}>enter password</Form.Label>
          <Form.Control
            type={visibility ? "text" : "password"}
            placeholder="Password"
            required
            name="password"
            value={user.password}
            onChange={HandleChange}
            style={{ border: "1px solid cyan" }}
          />
        </Form.Group>
        {visibility ? (
          <AiFillEye
            style={{ fontSize: "150%", margin: "0 50%", padding: "0" }}
            onClick={() => setVisibility(!visibility)}
          />
        ) : (
          <AiTwotoneEyeInvisible
            style={{ fontSize: "150%", margin: "0 50%", padding: "0" }}
            onClick={() => setVisibility(!visibility)}
          />
        )}
        <Form.Group controlId="formBasicPassword">
          <Form.Control
            type={visibility ? "text" : "password"}
            placeholder="confirm Password"
            required
            name="confirmpassword"
            value={user.confirmpassword}
            onChange={HandleChange}
            style={{ border: "1px solid cyan" }}
          />
        </Form.Group>
        <b>{loginE}</b>
        <hr />
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={HandleClick}
          block
          style={{ width: "100%" }}
        >
          Signup
        </Button>
        <hr />
        already registered ?{" "}
        <Link style={{ color: "white" }} to="/login">
          login
        </Link>
      </Form>
    </div>
  );
}

const mapStateToProps = (store) => ({
  loginE: store.userStore.loginE,
});

export default connect(mapStateToProps, {
  signupAction,
})(withRouter(Signup));
