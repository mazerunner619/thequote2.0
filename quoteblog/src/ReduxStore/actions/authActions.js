//upload posts
//edit posts
//delete posts
//comment and like posts
import axios from "axios";

import {
  UPLOAD_POST,
  UPLOAD_POST_SUCCESS,
  UPLOAD_POST_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  EDIT_POST,
  EDIT_POST_SUCCCESS,
  EDIT_POST_ERROR,
  LIKE_POST,
  LIKE_POST_SUCCESS,
  LIKE_POST_ERROR,
  COMMENT,
  COMMENT_SUCCESS,
  COMMENT_ERROR,
  REVERT_AUTH,
  DELETE_NOTIFICATION,
  DELETE_ALL_NOTIFICATION,
  SEND_REQUEST,
  DELETE_REQUEST,
  ACCEPT_REQUEST,
} from "../actionTypes";

export const uploadNewPost = (post, userid) => async (dispatch) => {
  try {
    //console.log('dispatched upload_post');
    dispatch({
      type: UPLOAD_POST,
    });

    const { data } = await axios.post(`/user/newpost/${userid}`, post);
    if (data) {
      //console.log('dispatched upload_post_success');
      dispatch({
        type: UPLOAD_POST_SUCCESS,
      });
      setTimeout(() => {
        dispatch({ type: REVERT_AUTH });
      }, 2000);
    } else {
      //console.log('dispatched upload_post_errro');
      dispatch({
        type: UPLOAD_POST_ERROR,
        payload: "something went wrong",
      });
    }
  } catch (err) {
    //console.log('dispatched upload_post_errro');
    dispatch({
      type: UPLOAD_POST_ERROR,
      payload: err.message,
    });
    setTimeout(() => {
      dispatch({ type: REVERT_AUTH });
    }, 2000);
  }
};

export const editPost = (postid, userid, post) => async (dispatch) => {
  try {
    //console.log('dispatched edit_post');
    dispatch({
      type: EDIT_POST,
    });
    const { data } = await axios.post(`/user/${userid}/edit/${postid}`, post);
    if (data) {
      //console.log('dispatched edit_post_success');
      dispatch({
        type: EDIT_POST_SUCCCESS,
      });
      setTimeout(() => {
        dispatch({ type: REVERT_AUTH });
      }, 2000);
    } else {
      //console.log('dispatched edit_post_errro');
      dispatch({
        type: EDIT_POST_ERROR,
        payload: "something went wrong",
      });
    }
  } catch (err) {
    //console.log('dispatched edit_post_errro');
    dispatch({
      type: EDIT_POST_ERROR,
      payload: err.message,
    });
    setTimeout(() => {
      dispatch({ type: REVERT_AUTH });
    }, 2000);
  }
};

export const deletePost = (postid, userid) => async (dispatch) => {
  try {
    //console.log('dispatched delete_post');
    dispatch({
      type: DELETE_POST,
    });
    const { data } = await axios.delete(`/user/${userid}/delete/${postid}`);
    if (data) {
      //console.log('dispatched delete_post_success');
      dispatch({
        type: DELETE_POST_SUCCESS,
      });
      setTimeout(() => {
        dispatch({ type: REVERT_AUTH });
      }, 2000);
    } else {
      //console.log('dispatched delete_post_errro');
      dispatch({
        type: DELETE_POST_ERROR,
        payload: "something went wrong",
      });
    }
  } catch (err) {
    //console.log('dispatched delete_post_errro');
    dispatch({
      type: DELETE_POST_ERROR,
      payload: err.message,
    });

    setTimeout(() => {
      dispatch({ type: REVERT_AUTH });
    }, 2000);
  }
};

export const likePost = (postid, userid) => async (dispatch) => {
  try {
    //console.log('dispatched delete_post');
    dispatch({
      type: LIKE_POST,
    });
    await axios.post(`/user/${userid}/like/${postid}`);
    //console.log('dispatched delete_post_success');
    dispatch({
      type: LIKE_POST_SUCCESS,
    });
  } catch (err) {
    //console.log('dispatched delete_post_errro');
    dispatch({
      type: LIKE_POST_ERROR,
      payload: err.message,
    });
  }
};

export const deleteAllNotifications = (userId) => async (dispatch) => {
  try {
    //console.log('dispatched deleteAll_noti');
    dispatch({
      type: DELETE_ALL_NOTIFICATION,
    });
    await axios.post(`/user/${userId}/notification/deleteall`);
  } catch (err) {
    //console.log('delete noti error',err);
  }
};

export const deleteNotification = (userId, notiId) => async (dispatch) => {
  try {
    //console.log('dispatched delete_noti');
    dispatch({
      type: DELETE_NOTIFICATION,
    });
    await axios.post(`/user/${userId}/notification/${notiId}/delete`);
  } catch (err) {
    //console.log('delete noti error',err);
  }
};

export const sendRequest = (senderid, receiverid) => async (dispatch) => {
  try {
    //console.log('dispatched send_req__');
    dispatch({
      type: SEND_REQUEST,
    });
    await axios.post(`/user/request/${senderid}/${receiverid}`);
    return true;
  } catch (err) {
    //console.log('delete noti error',err);
  }
};

export const acceptRequest = (userid, reqid) => async (dispatch) => {
  try {
    //console.log('dispatched accpt req');
    dispatch({
      type: ACCEPT_REQUEST,
    });
    await axios.post(`user/${userid}/requests/${reqid}/accept`);
    return true;
  } catch (err) {
    //console.log('accept req error',err);
  }
};

export const deleteRequest = (userid, reqid) => async (dispatch) => {
  try {
    //console.log('dispatched delete_noti');
    dispatch({
      type: DELETE_REQUEST,
    });
    await axios.post(`user/${userid}/requests/${reqid}/delete`);
    return true;
  } catch (err) {
    //console.log('delete req error',err);
  }
};
