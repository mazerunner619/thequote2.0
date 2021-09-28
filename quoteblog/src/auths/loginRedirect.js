import {useEffect} from 'react';

export default LoginRedirect = () =>{
    useEffect(() => {
        if(!loggedIn)
        hist.push('/login');
        // else{
        //   createSocket();
        //   getonline(loggedUser);
        // }
      }, [loggedIn])
    
}