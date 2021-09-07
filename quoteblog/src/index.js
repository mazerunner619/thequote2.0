import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './bootswach/bootstrap.min5.css';  

//redux store and provider
import {Provider} from 'react-redux'
import store from './ReduxStore/index'

ReactDOM.render(
  <Provider store={store}>
    <App />
    </Provider>
    ,
  document.getElementById('root')
);
