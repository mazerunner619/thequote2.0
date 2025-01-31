import "./App.css";
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
  return (
    <>
      <Router />
    </>
  );
}
export default App;
