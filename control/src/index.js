import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase/app';
import 'firebase/database';
import firebaseConfig from './firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
// import * as serviceWorker from './serviceWorker';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

let db = firebase.database();

// COMMENT THIS OUT FOR PRODUCTION!
// db.ref('/').set({});

ReactDOM.render(
  <React.StrictMode>
    <App db={db} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
