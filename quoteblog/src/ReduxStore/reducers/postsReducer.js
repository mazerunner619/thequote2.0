import {
  GET_ALL_POSTS,
  GET_ALL_POSTS_SUCCESS,
  GET_ALL_POSTS_ERROR,
  GET_MY_POSTS,
  GET_MY_POSTS_SUCCESS,
  GET_MY_POSTS_ERROR,
  GET_POST,
  GET_POST_SUCCESS,
  GET_POST_ERROR,
  GET_USER_POSTS,
  GET_USER_POSTS_SUCCESS,
  GET_USER_POSTS_ERROR,
} from "../actionTypes";

const INITIAL_STATE = {
  page: 1,
  totalCount: 1,
  allPosts: [],
  myPosts: [],
  userPosts: [],
  userPostsL: false,
  userPostsS: false,
  post: {},
  loading: false,
  error: null,
};

export const LIMIT = 5;
export const DEFAULT_POST_IMG =
  "https://images.unsplash.com/photo-1521840891849-69baa8035cc7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsbHxlbnwwfHwwfHx8MA%3D%3D";

export default function postsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_POSTS:
      return {
        ...state,
        loading: true,
      };

    case GET_ALL_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        allPosts: action.payload.newPost
          ? action.payload.posts
          : [...state.allPosts, ...action.payload.posts],
        page: action.payload.page,
        totalCount: action.payload.totalCount,
      };

    case GET_ALL_POSTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_MY_POSTS:
      return {
        ...state,
        userPostsL: true,
        userPostsS: false,
      };

    case GET_MY_POSTS_SUCCESS:
      return {
        ...state,
        userPostsL: false,
        myPosts: action.payload,
        userPostsS: true,
      };

    case GET_MY_POSTS_ERROR:
      return {
        ...state,
        userPostsL: false,
        error: action.payload,
        userPostsS: false,
      };

    case GET_USER_POSTS:
      return {
        ...state,
        userPostsL: true,
        userPostsS: false,
      };

    case GET_USER_POSTS_SUCCESS:
      return {
        ...state,
        userPosts: action.payload,
        userPostsL: false,
        userPostsS: true,
      };

    case GET_USER_POSTS_ERROR:
      return {
        ...state,
        userPostsL: false,
        userPostsS: false,
      };

    case GET_POST:
      return {
        ...state,
        loading: true,
      };

    case GET_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload,
      };

    case GET_POST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
