import {
    GET_ALL_POSTS,
    GET_ALL_POSTS_SUCCESS,
    GET_ALL_POSTS_ERROR,

    GET_MY_POSTS,
    GET_MY_POSTS_SUCCESS,
    GET_MY_POSTS_ERROR,

    GET_POST,
    GET_POST_SUCCESS,
    GET_POST_ERROR 
    } from '../actionTypes'

const INITIAL_STATE = {
    allPosts : [],
    myPosts : [],
    post : {},
    loading : false,
    error : null
}

export default function postsReducer( state = INITIAL_STATE, action){

    switch(action.type){
        case GET_ALL_POSTS : return{
            ...state,
            loading : true
        }

        case GET_ALL_POSTS_SUCCESS : return{
            ...state,
            loading : false,
            allPosts : action.payload
        }

        case GET_ALL_POSTS_ERROR : return{
            ...state,
            loading : false,
            error : action.payload
        }

        case GET_MY_POSTS : return{
            ...state,
            loading : true
        }

        case GET_MY_POSTS_SUCCESS : return{
            ...state,
            loading : false,
            myPosts : action.payload
        }

        case GET_MY_POSTS_ERROR : return{
            ...state,
            loading : false,
            error : action.payload
        }

        case GET_POST : return {
            ...state,
            loading : true
        }

        case GET_POST_SUCCESS : return{
            ...state,
            loading : false,
            post : action.payload
        }
        
        case GET_POST_ERROR : return{
            ...state,
            loading : false,
            error : action.payload
        } 

        default : return state
    }

}