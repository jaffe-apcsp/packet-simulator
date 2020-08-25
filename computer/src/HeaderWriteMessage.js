import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import C from "system-constants";

const HeaderWriteMessage = props => {

  const [removed, setRemoved] = useState(false);
  const [to, setTo] = useState('');

  let cId = <h3>Computer ID: {props.computerId} | Name: {props.name}</h3>

  useEffect(() => {
    setRemoved(props.computers[props.computerId] === undefined);
  }, [props.computerId, props.computers]);

  useEffect(() => {
    if (!removed) return;
    localStorage.removeItem(C.LOCAL_STORAGE_KEY);
  }, [removed])

  useEffect(() => {
    if (props && props.gameState != C.STANDBY) {
      let toRec = props.computers[props.computerId];
      if (toRec) {
        setTo(props.computers[toRec.to].name);
      }
    }
  }, [props.computers])

  let header;
  switch (props.gameState) {
    case C.STANDBY:
      header = <h4>Waiting for computers to join the network...</h4>;
      break;

    case C.WRITE_MESSAGES:
      header = <h4>Compose your message to {to}</h4>;
      break;

    case C.PLAY:
      header = <h4>Process packets</h4>;
      break;

    default:
      header = <h4>Please wait...</h4>;
      break;
  }

  return (
    <Row className="access-code">
      {
        removed ?
          <Col><h4>You have been removed. Please reload the page and join again</h4></Col> :
          <Col>
            {cId}
            {header}
          </Col>
      }
    </Row>
  );
}

export default HeaderWriteMessage;
