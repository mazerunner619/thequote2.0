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

    <footer className="bg-dark text-center text-white">
 
  <div className="footer">
    © 2021 @Copyright{'  '}<a href="https://www.instagram.com/happiest_depressed_1/" style={{color : 'white', fontSize : "20px"}}>{' '}{' '}<SiInstagram /> </a>
  </div>
</footer>
    </>    
  );

}
export default App;



