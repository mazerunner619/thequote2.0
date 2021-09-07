import {SiInstagram} from 'react-icons/si'
import './App.css';
import Router from './ParentRouter'

import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {

  return (
    <>
    <Router />

 <footer className="text-center text-white"  >
  <div className="footer">
    ©mazerunner619{'  '}<a href="https://www.instagram.com/happiest_depressed_1/" style={{color : 'white', fontSize : "20px"}}>{' '}{' '}<SiInstagram /> </a>
  </div>
</footer>
    </>    
  );

}
export default App;



