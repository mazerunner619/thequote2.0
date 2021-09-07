import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

// creating context to use globally

const AuthContext = createContext(); //returns an object with all the features of the context

function AuthContextProvider(props) {

    const [logged, setLogged] = useState(undefined);
    const [loggedUser, setLoggedUser] = useState({});
    const [posts, setPosts] = useState([]);
    
    async function getLogged(){
            const loggedInRes = await axios.get('user/isLogged');
            setLogged(loggedInRes.data);
            console.log('logged in res: '+ loggedInRes.data);
    }

    async function getAllPosts(){
        const {data} = await axios.get('/quotes');
        setPosts(data);
        console.log('Fetched all posts All Posts', posts);
}

    async function getLoggedUser(){
            const loggedUserRes = await axios.get('user/current');
            setLoggedUser(loggedUserRes.data);
            console.log('logged in res: '+ loggedUserRes.data);
    }
 
    
    useEffect( () => {
        getLogged();
        getLoggedUser();
    }, []);

    return (
    <AuthContext.Provider value ={{logged, getLogged,loggedUser , getLoggedUser ,getAllPosts, posts}}>
        {props.children}
    </AuthContext.Provider>
    )
};

export {AuthContextProvider};
export default AuthContext;






