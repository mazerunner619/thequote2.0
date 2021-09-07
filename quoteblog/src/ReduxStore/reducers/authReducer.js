import {
    UPLOAD_POST,
    UPLOAD_POST_SUCCESS,
     UPLOAD_POST_ERROR,
     DELETE_POST,
    DELETE_POST_SUCCESS,
     DELETE_POST_ERROR,
    EDIT_POST,
    EDIT_POST_SUCCCESS,
     EDIT_POST_ERROR ,
     LIKE_POST ,
    LIKE_POST_SUCCESS,
    LIKE_POST_ERROR ,
    COMMENT,
     COMMENT_SUCCESS,
     COMMENT_ERROR,
     REVERT_AUTH,
     DELETE_NOTIFICATION,
     DELETE_ALL_NOTIFICATION
    } from '../actionTypes'


    const INITIAL_STATE = {
        uploading : false,
        uploaded : false,
        uploadError : null,
        
        liking : false,
        liked : false,
        likeError : null,

        commenting : false,
        commented : false,
        commentError : null,
            
        deleting : false,
        deleted : false,
        deleteError : null,

        editing : false,
        edited : false,
        editError : null
    }



    const authReducer =  (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case UPLOAD_POST:
           return {
               uploading : true
           }
    
        case UPLOAD_POST_SUCCESS:
        return {
            ...state,
            uploading : false,
            uploaded : true
    }

        case UPLOAD_POST_ERROR : 
        return{
            ...state,
            uploading : false,
            uploaded : false,
            uploadError : action.payload
        }
    

        case DELETE_POST : 
            return{
                ...state, 
                deleting : true
        }
    
        case DELETE_POST_SUCCESS :{
            return{
                ...state, 
                deleting : false, 
                deleted : true
            }
        }
        case DELETE_POST_ERROR :{
            return{
                ...state, 
                deleting : false, 
                deleted : false, 
                deleteError : action.payload
            }
        }

        case EDIT_POST :  {
            return{
                ...state, 
                editing : true
            }
        }
        case EDIT_POST_SUCCCESS : {
            return{
                ...state, 
                editing : false, 
                edited : true
            }
        }
        case EDIT_POST_ERROR: {
            return{
                ...state, 
                editing : false, 
                edited : false, 
                editError : action.payload
            }
        }

        case LIKE_POST : {
            return{

            }
        }

        
        case DELETE_NOTIFICATION : {
            return{

            }
        }
        case DELETE_ALL_NOTIFICATION :{
            return {}
        }


        case LIKE_POST_SUCCESS : {
            return{

            }
        }
        case LIKE_POST_ERROR : {
            return{

            }
        }

        case COMMENT : {
            return{

            }
        }
        case COMMENT_SUCCESS : {
            return{

            }
        }
        case COMMENT_ERROR : {
            return{

            }
        }

        case REVERT_AUTH : {
            return{
                uploading : false,
                uploaded : false,
                uploadError : null,
                
                liking : false,
                liked : false,
                likeError : null,
        
                commenting : false,
                commented : false,
                commentError : null,
                    
                deleting : false,
                deleted : false,
                deleteError : null,
        
                editing : false,
                edited : false,
                editError : null
            }
        }

        default : return state
    }

}

export default authReducer;