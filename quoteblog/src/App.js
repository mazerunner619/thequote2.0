import { useState } from "react";
import "./App.css";
import ResponsiveDrawer from "./components/drawer";
import ShowDP from "./components/profilePicOpen";
import Router from "./ParentRouter";
import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
    if (err.status === 500)
      err.message = "Unable to reach servers! try again after sometime";
    return Promise.reject(err);
  }
);

function App() {
  const [editModal, setEditModal] = useState(true);
  return (
    <>
      {/* <div>
        <h1>Posts</h1>
        <ShowDP
          show={editModal}
          onHide={() => setEditModal(false)}
          image={"currimg"}
          post={""}
          uploader={""}
        />
      </div> */}
      <Router />
    </>
  );
}
export default App;
