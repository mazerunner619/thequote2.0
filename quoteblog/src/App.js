import {SiInstagram} from 'react-icons/si'
import './App.css';
import Router from './ParentRouter'

import axios from 'axios';
import { AuthContextProvider } from './context/authContext';

axios.defaults.withCredentials = true;

function App() {

  return (
    <>
    <AuthContextProvider>
    <Router />
    </AuthContextProvider>

 <footer className="text-center text-white" style ={{padding :"1%", backgroundColor : "lightcoral",  border : "2px solid grey"}} >
 
  <div className="footer">
    © Copyright | mazerunner619{'  '}<a href="https://www.instagram.com/happiest_depressed_1/" style={{color : 'white', fontSize : "20px"}}>{' '}{' '}<SiInstagram /> </a>
  </div>
</footer>
    </>    
  );

}
export default App;



