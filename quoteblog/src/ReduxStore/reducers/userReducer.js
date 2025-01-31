import {
  GET_LOGGED_USER,
  GET_LOGGED_USER_SUCCESS,
  GET_LOGGED_USER_ERROR,
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  USER_NOTIFICATION,
  USER_NOTIFICATION_SUCCESS,
  USER_NOTIFICATION_ERROR,
  LOGIN,
  LOGOUT,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNUP,
  SIGNUP_SUCCESS,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_REVERT,
  USER_ROOMS,
  USER_ROOMS_SUCCESS,
  USER_ROOMS_ERROR,
} from "../actionTypes";

const INITIAL_STATE = {
  loggedUser: {},
  findUser: {},
  findUserS: false,
  findUserE: null,
  findUserLoading: false,
  loggedIn: false,
  loading: false,
  error: null,
  loadingN: false,
  notifications: [],
  errorN: null,
  logging: false,
  loginE: null,
  signingup: false,
  updateP: false,
  updatePS: false,
  updatePE: null,
  userRequests: [],
  userRooms: [],
  loadingRooms: false,
  userConnections: [],
};

export const DEFAULT_PROFILE_PICTURE =
  "https://workhound.com/wp-content/uploads/2017/05/placeholder-profile-pic.png";

export default function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_LOGGED_USER:
      return {
        ...state,
        loading: true,
      };

    case GET_LOGGED_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedIn: true,
        loggedUser: action.payload,
      };

    case GET_LOGGED_USER_ERROR:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        loggedUser: {},
        error: action.payload,
      };

    case GET_USER:
      return {
        ...state,
        findUserLoading: true,
      };

    case USER_ROOMS:
      return {
        ...state,
        loadingRooms: true,
      };

    case USER_ROOMS_SUCCESS:
      return {
        ...state,
        loadingRooms: false,
        userRooms: action.payload,
      };

    case USER_ROOMS_ERROR:
      return {
        ...state,
        loadingRooms: false,
        userRooms: [],
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        findUserLoading: false,
        findUserS: true,
        findUser: action.payload,
      };

    case GET_USER_ERROR:
      return {
        ...state,
        findUserLoading: false,
        findUserS: {},
        findUserE: action.payload,
      };

    case USER_NOTIFICATION:
      return {
        ...state,
        loadingN: true,
      };

    case USER_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loadingN: false,
        notifications: action.payload,
      };

    case USER_NOTIFICATION_ERROR:
      return {
        ...state,
        loadingN: false,
        errorN: action.payload,
      };

    case LOGIN:
      return {
        ...state,
        logging: true,
      };

    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
        loggedUser: {},
        notifications: [],
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loginE: null,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginE: action.payload,
      };

    case SIGNUP:
      return {
        ...state,
        signingup: true,
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        signingup: false,
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        updateP: true,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        updateP: false,
        updatePS: true,
        updatePE: action.payload,
      };
    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        updateP: false,
        updatePS: false,
        updatePE: action.payload,
      };
    case UPDATE_PROFILE_REVERT:
      return {
        ...state,
        updateP: false,
        updatePS: false,
        updatePE: null,
      };

    default:
      return state;
  }
}
