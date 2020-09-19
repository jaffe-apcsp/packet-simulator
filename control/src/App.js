import React, { useState } from 'react';
import './control.css';
import initState from "./initState";
import Login from "./Login";
import Header from "./Header";
import ComputerList from './ComputerList';
import Footer from './Footer';
import { Container, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const App = props => {

  const [state, setState] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const connect = (accessCode, reconnect = false) => {
    // Save the time and access code to localStorage in case the
    // the session has to be reconnected
    localStorage.setItem(C.LOCAL_STORAGE_KEY,
      JSON.stringify({
        time: (new Date()).getTime(),
        accessCode
      })
    );

    // If we're not reconnecting, then initialize the state
    if (!reconnect) {
      props.db.ref(accessCode).set(initState(accessCode))
        .catch(err => {
          if (err.code === 'PERMISSION_DENIED') {
            setPermissionDenied(true);
          }
          console.log(err);
        })
    };
    // And set up a listener for changes in the Firebase state
    props.db.ref(accessCode).on('value', snap => {
      setState(snap.val());
    });
  }

  const back = evt => {
    processStateChange(state.gameState-1);
  }

  const next = evt => {
    let newGameState = (state.gameState+1) % (C.PLAY+1);
    processStateChange(newGameState);
  }

  const processStateChange = newGameState => {
    let payload = {};
    if (newGameState === C.STANDBY) {
      payload.computers = R.mapObjIndexed((val, key, obj) => {
        return R.pick(['key','lastPint','name'], val);
      }, state.computers);
    } else if (newGameState === C.WRITE_MESSAGES) {
      payload.computers = R.clone(state.computers);
      let cKeys = R.keys(state.computers);
      let offset = parseInt(cKeys.length / 2, 10);
      let length = cKeys.length;
      cKeys.forEach((cKey, idx) => {
        payload.computers[cKey].to = cKeys[(idx + offset) % length];
        payload.computers[cKey].lastPing = (new Date()).getTime();
        payload.computers[cKey].locked = false;
      });
    } else if (newGameState === C.PLAY) {
      payload.ring = Object.keys(state.computers).sort((a, b) => a < b ? -1 : 1);
    }
    payload.gameState = newGameState;
    props.db.ref(state.accessCode).update(payload);
  }

  if (permissionDenied) {
    return (
      <Container className="control">
        <Card>
          <CardHeader>
            <h3>Unable to start session</h3>
            <h4>Did you forget to set the Firebase rules for write access?</h4>
          </CardHeader>
        </Card>
      </Container>
    )
  } else {
    return (
      <Container className="control">
        <Card>
          <CardHeader>
            {
              state ?
                <Header {...state} db={props.db} next={next} back={back}/> :
                <Login {...state} connect={connect}/>
            }
          </CardHeader>
          <CardBody>
            {
              state ?
                <ComputerList {...state} db={props.db}/> : null
            }
          </CardBody>
          <CardFooter>
            <Footer {...state} db={props.db}/>
          </CardFooter>
        </Card>
      </Container>
    );
  }
}

export default App;
