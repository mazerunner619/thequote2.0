import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router";
import { Button } from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import { Login as LoginAction } from "../ReduxStore/actions/userActions";
import { withRouter, Link } from "react-router-dom";
import { LOGIN_ERROR } from "../ReduxStore/actionTypes";

function Login({ LoginAction, loginE }) {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch({ type: LOGIN_ERROR, payload: null });
    };
  }, []);

  const hist = useHistory();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  function HandleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  }
  async function HandleClick(e) {
    e.preventDefault();
    LoginAction(user, hist);
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
          Login
        </h2>
        <hr />
        {/* <hr style={{color : "lightcoral", border : "2px solid lightcoral", borderRadius : "5px", margin : "0 auto", width :  "90%", marginBottom : "2%"}} /> */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label style={{ color: "black" }}>username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            required
            name="username"
            value={user.username}
            onChange={HandleChange}
            style={{ border: "1px solid whitesmoke" }}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label style={{ color: "black" }}>password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            name="password"
            value={user.password}
            onChange={HandleChange}
            style={{ border: "1px solid whitesmoke" }}
          />
        </Form.Group>
        <b>{loginE}</b>
        <br />
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={HandleClick}
          block
          style={{ width: "100%" }}
        >
          Login
        </Button>
        <hr />
        don't have an account ?{" "}
        <Link style={{ color: "white" }} to="/signup">
          signup
        </Link>
      </Form>
    </div>
  );
}

const mapStateToProps = (store) => ({
  loginE: store.userStore.loginE,
});

export default connect(mapStateToProps, {
  LoginAction,
})(withRouter(Login));
