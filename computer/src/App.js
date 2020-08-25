import React, { useState, useReducer } from 'react';
import reducer from "./reducer";
import Login from "./Login";
import Header from './Header';
import Process from './Process';
import MessageInput from "./MessageInput";
import Footer from './Footer';
import { Container, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import C from "system-constants";

const App = props => {

  const [state, dispatch] = useReducer(reducer, {accessCode:null});
  const [dbState, setDbState] = useState(null);

  const join = obj => {
    props.db.ref(obj.accessCode).on('value', snap => {
      setDbState(snap.val());
    });
    dispatch({type: C.JOIN, computerId: obj.computerId, name: obj.name});
    if (!obj.rejoin) {
      props.db.ref(obj.accessCode+'/computers/'+obj.computerId).set({
        key: obj.computerId,
        name: obj.name,
        lastPing: (new Date()).getTime()
      });
    } else {
      props.db.ref(obj.accessCode+'/computers/'+obj.computerId).update({name: obj.name});
    }
  };

  let cardBody = null;
  if (dbState) {
    switch (dbState.gameState) {
      case C.STANDBY:
        break;

      case C.WRITE_MESSAGES:
        cardBody = (
          <MessageInput db={props.db} {...state} {...dbState} />
        )
        break;

      case C.PLAY:
        cardBody = <Process db={props.db} {...state} {...dbState} />
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
            dbState ? <Header {...state} {...dbState} /> : <Login dispatch={dispatch} join={join} />
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
