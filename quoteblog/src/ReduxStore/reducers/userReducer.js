import {
    GET_LOGGED_USER, 
    GET_LOGGED_USER_SUCCESS,
    GET_LOGGED_USER_ERROR,
    GET_USER ,
    GET_USER_SUCCESS ,
    GET_USER_ERROR ,
    USER_NOTIFICATION,
    USER_NOTIFICATION_SUCCESS,
    USER_NOTIFICATION_ERROR,
    LOGIN,
    LOGOUT,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    SIGNUP,
    SIGNUP_SUCCESS
    } from '../actionTypes'

const INITIAL_STATE = {
    loggedUser : {} ,
    loggedIn : false,
    loading : false,
    error : null,
    loadingN : false,
    notifications : [],
    errorN : null,
    logging : false,
    loginE : null,
    signingup : false
}

export default function userReducer( state = INITIAL_STATE, action){

    switch(action.type){
        case GET_LOGGED_USER : return{
            ...state,
            loading : true
        }

        case GET_LOGGED_USER_SUCCESS : return{
            ...state,
            loading : false,
            loggedIn : true,
            loggedUser : action.payload
        }

        case GET_LOGGED_USER_ERROR : return{
            ...state,
            loading : false,
            loggedIn : false,
            loggedUser : {},
            error : action.payload
        }

        case USER_NOTIFICATION : return{
            loadingN : true,
        }

        case USER_NOTIFICATION_SUCCESS : return{
            loadingN : false,
            notifications : action.payload
        }

        case USER_NOTIFICATION_ERROR : return{
            loadingN : false,
            errorN : action.payload
        }

        case LOGIN : return{
            logging : true
        }

        case LOGOUT : return{
            loggedIn : false,
            loggedUser : {},
            notifications : []
        }


        case LOGIN_SUCCESS : return{
            loggedIn : true
        }
        case LOGIN_ERROR : return{
            loginE : action.payload
        }

        case SIGNUP : return{
            signingup : true
        }

        case SIGNUP_SUCCESS : return{
            signingup : false
        }

        default : return state
    }

}