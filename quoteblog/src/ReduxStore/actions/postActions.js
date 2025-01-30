import {
  GET_ALL_POSTS_ERROR,
  GET_ALL_POSTS,
  GET_ALL_POSTS_SUCCESS,
  GET_POST,
  GET_POST_ERROR,
  GET_POST_SUCCESS,
  GET_MY_POSTS,
  GET_MY_POSTS_ERROR,
  GET_MY_POSTS_SUCCESS,
  GET_USER_POSTS,
  GET_USER_POSTS_SUCCESS,
  GET_USER_POSTS_ERROR,
} from "../actionTypes";

import { getLoggedUser } from "./userActions";
import axios from "axios";

//fetch all the DB posts
export const getAllPosts =
  (page = 1, totalCount = -1) =>
  async (dispatch) => {
    try {
      if (Number(page) === 1)
        dispatch({
          type: GET_ALL_POSTS,
        });

      const query = `/getallposts?page=${page.toString()}&totalCount=${totalCount.toString()}`;
      const { data } = await axios.get(query);
      dispatch({
        type: GET_ALL_POSTS_SUCCESS,
        payload: {
          posts: data.items,
          page: data.currentPage,
          totalCount: data.totalCount,
        },
      });
      return data.items;
    } catch (error) {
      //console.log(error.message);
      dispatch({ type: GET_ALL_POSTS_ERROR, payload: error.message });
    }
  };

//get post by its id => only one post
export const getPost = (postID) => async (dispatch) => {
  try {
    dispatch({
      type: GET_POST,
    });

    const { data } = await axios.get(`/getpost/${postID}`);
    dispatch({ type: GET_POST_SUCCESS, payload: data });
    return data;
  } catch (error) {
    //console.log(error.message);
    dispatch({ type: GET_POST_ERROR, payload: error.message });
  }
};

//get all posts of a user
export const getMyPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: GET_MY_POSTS,
    });
    const currUser = await axios.get("/current");
    const { data } = await axios.get(`/getmyposts/${currUser.data._id}`);
    dispatch({ type: GET_MY_POSTS_SUCCESS, payload: data });
    //console.log('from redux store',data)
    return data;
  } catch (error) {
    //console.log(error.message);
    dispatch({ type: GET_MY_POSTS_ERROR, payload: error.message });
  }
};

//get all posts of a user
export const getUserPosts = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_USER_POSTS,
    });
    const { data } = await axios.get(`/getmyposts/${id}`);
    dispatch({ type: GET_USER_POSTS_SUCCESS, payload: data });
    //console.log('from redux store',data)
    return data;
  } catch (error) {
    //console.log(error.message);
    dispatch({ type: GET_USER_POSTS_ERROR, payload: error.message });
  }
};
