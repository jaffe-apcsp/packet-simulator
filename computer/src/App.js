import React, { useState, useReducer } from 'react';
import reducer from "./reducer";
import Login from "./Login";
import Header from './Header';
import ProcessHeader from './ProcessHeader';
import MessageInput from "./MessageInput";
import Footer from './Footer';
import { Container, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import C from "system-constants";

const App = props => {

  const [appState, dispatch] = useReducer(reducer, {accessCode:null});
  const [dbState, setDbState] = useState(null);
  const [invalidSession, setInvalidSession] = useState(false);

  const join = obj => {
    dispatch({type: C.JOIN, computerId: obj.computerId, name: obj.name});
    props.db.ref(obj.accessCode).on('value', snap => {
      let data = snap.val();
      if (data.accessCode) {
        setDbState(data);
      } else {
        setInvalidSession(true);
        localStorage.removeItem(C.LOCAL_STORAGE_KEY);
      }
    });
    props.db.ref(obj.accessCode+'/computers/'+obj.computerId).set({
      key: obj.computerId,
      name: obj.name,
      lastPing: (new Date()).getTime()
    });
  };

  const rejoin = obj => {
    let { accessCode, name, computerId } = obj;
    dispatch({type: C.JOIN, computerId, name});
    props.db.ref(accessCode).on('value', snap => {
      setDbState(snap.val());
    })
  }

  let cardBody = null;
  if (dbState) {
    switch (dbState.gameState) {
      case C.STANDBY:
        break;

      case C.WRITE_MESSAGES:
        cardBody = (
          <MessageInput db={props.db} appState={appState} dbState={dbState} />
        )
        break;

      case C.PLAY:
        cardBody = <ProcessHeader db={props.db} appState={appState} dbState={dbState} />
        break;

      default:
        break;
    }
  }

  return (
    <Container className="control">
      <Card>
        <CardHeader>
          {
            dbState ?
              <Header appState={appState} dbState={dbState} /> :
              <Login dispatch={dispatch}
                     invalidSession={invalidSession}
                     join={join}
                     rejoin={rejoin} />
          }
        </CardHeader>
        <CardBody>
          {cardBody}
        </CardBody>
        <CardFooter>
          <Footer />
        </CardFooter>
      </Card>
    </Container>
  );
}

export default App;
