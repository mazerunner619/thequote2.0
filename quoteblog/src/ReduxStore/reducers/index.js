import { combineReducers } from 'redux';
import postStore from "./postsReducer";
import userStore from "./userReducer";
import authStore from './authReducer'
const rootreducer = combineReducers({
     postStore,
     userStore,
     authStore
});
export default rootreducer;
