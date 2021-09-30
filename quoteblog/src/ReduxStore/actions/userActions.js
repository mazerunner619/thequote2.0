import {
    GET_LOGGED_USER, 
    GET_LOGGED_USER_SUCCESS,
    GET_LOGGED_USER_ERROR,
    LOGIN,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    SIGNUP,
    SIGNUP_ERROR,
    SIGNUP_SUCCESS,
    GET_USER ,
    GET_USER_SUCCESS ,
    GET_USER_ERROR ,
USER_NOTIFICATION,
 USER_NOTIFICATION_SUCCESS,
  USER_NOTIFICATION_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_REVERT,
  LOGOUT,
  USER_ROOMS,
  USER_ROOMS_SUCCESS,
  USER_ROOMS_ERROR
}
from '../actionTypes'

import axios from 'axios'
import { useHistory } from 'react-router';

export const getLoggedUser = () => async(dispatch)=>{
    try{

        console.log('called gt log usrr');
        dispatch({
            type : GET_LOGGED_USER
        });
        const {data} = await axios.get('/current');
        console.log('useAction response',data);
        if(data){
            console.log('caslled gt log usrr suuccess');
        dispatch({ type : GET_LOGGED_USER_SUCCESS , payload : data });
        return data;
        }
        else {
            dispatch({ type : GET_LOGGED_USER_ERROR , payload : "not logged in" });
        }

    }catch(error){
        console.log(error.message);
        dispatch({ type : GET_LOGGED_USER_ERROR , payload : error.message });
    }
}


export const Login = (info, history) => async(dispatch)=>{
    try{
        console.log('logging in ......');
        dispatch({
            type : LOGIN
        });
        const {data} = await axios.post('/login', info);
        if(data){
        const currUser = await axios.get('/current');
        dispatch({ type : GET_LOGGED_USER_SUCCESS , payload : currUser.data });
        history.push('/');
        }   
        else{
            dispatch({ type : LOGIN_ERROR , payload : 'wrong username or password' });
        }

    }catch(error){
        console.log(error);
        dispatch({ type : LOGIN_ERROR , payload : error.message });
    }
}



export const Logout = (history) => (dispatch)=>{
    console.log('logging out ');
     axios.post('/user/logout');
     dispatch({type : LOGOUT });
    history.push('/login');
    
}



export const Signup = (info, history) => async(dispatch)=>{
    try{
        console.log('signing in ......');
        dispatch({
            type : SIGNUP
        });
        const {data} = await axios.post('/signup', info);
        if(data.status){
        dispatch({ type : SIGNUP_SUCCESS});
        history.push('/login');
        }   
        else{
            dispatch({ type : LOGIN_ERROR , payload : data.message });
        }
    }catch(error){
        console.log(error);
        dispatch({ type : LOGIN_ERROR , payload : error.message });
    }
}



//get post by its id => only one post 
export const getUser = (userID) => async(dispatch)=>{
    try{
        dispatch({
            type : GET_USER
        });

        const {data} = await axios.get(`/getuser/${userID}`);
        if(data){
        dispatch({ type : GET_USER_SUCCESS , payload : data });
        return data;
        }
        else{
            dispatch({ type : GET_USER_ERROR , payload : "counld't process at the moment" });
            return null;
        }
    }catch(error){
        console.log(error.message);
        dispatch({ type : GET_USER_ERROR , payload : error.message });
    }
}


//get post by its id => only one post 
export const getUserNotification = () => async(dispatch)=>{
    try{
        dispatch({
            type : USER_NOTIFICATION
        });
        const currUser = await axios.get('/current');
        const {data} = await axios.get(`user/notifications/${currUser.data._id}`);
        dispatch({ type : USER_NOTIFICATION_SUCCESS , payload : data });
        console.log(data);
        return data;
    }catch(error){
        console.log(error.message);
        dispatch({ type : USER_NOTIFICATION_ERROR , payload : error.message });
    }
}


//get user rooms
export const getLoggedUserRooms = () => async(dispatch)=>{
    try{
        dispatch({
            type : USER_ROOMS
        });
        const currUser = await axios.get('/current');
        const {data} = await axios.get(`/user/rooms/${currUser.data._id}`);
        dispatch({ type : USER_ROOMS_SUCCESS , payload : data });
        console.log(data);
        return data;
    }catch(error){
        console.log('user rooms error => ',error);
        dispatch({ type : USER_ROOMS_ERROR , payload : error.message });
    }
}

export const updateProfileInfo = (formdata) => async(dispatch)=>{
    try{
        dispatch({
            type : UPDATE_PROFILE
        });
        const currUser = await axios.get('/current');
        const {data} = await axios.post(`user/${currUser.data._id}/profile/update`, formdata);
        if(data.status){
            dispatch({
                type : UPDATE_PROFILE_SUCCESS, payload : data.message
            });
        }else{
            dispatch({
                type : UPDATE_PROFILE_ERROR,
                payload : data.message
            });
        }
        setTimeout(()=>
        dispatch({
            type : UPDATE_PROFILE_REVERT,
            payload : data.message
        })
        ,3000);
    }catch(error){
        console.log(error.message);
        dispatch({ type : UPDATE_PROFILE_ERROR , payload : error.message });
    }
}








