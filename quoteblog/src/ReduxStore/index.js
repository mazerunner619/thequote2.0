import rootReducer from "./reducers";
import {createStore , applyMiddleware , compose} from "redux";
import thunk from "redux-thunk";

    const store = createStore(
        rootReducer, 
        compose(
            applyMiddleware(thunk),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        ));

    export default store;
