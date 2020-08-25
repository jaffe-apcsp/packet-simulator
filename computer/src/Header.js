import React, { useState, useEffect } from 'react';
import { Col } from 'reactstrap';
import HeaderId from './HeaderId';
import HeaderRemoved from "./HeaderRemoved";
import C from "system-constants";

const Header = props => {

  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setRemoved(!props.computers || props.computers[props.computerId] === undefined);
  }, [props.computerId, props.computers]);

  useEffect(() => {
    if (!removed) return;
    localStorage.removeItem(C.LOCAL_STORAGE_KEY);
  }, [removed]);

  let header = null;
  if (removed) {
    header = <Col><HeaderRemoved /></Col>
  } else {
    switch (props.gameState) {
      case C.STANDBY:
        header = <Col>
          <HeaderId {...props} />
          <h4>Waiting for computers to join the network...</h4>
        </Col>
        break;

      case C.WRITE_MESSAGES:
        header = <Col>
          <HeaderId {...props} />
          <h4>Write your message!</h4>
        </Col>
        break;

      case C.PLAY:
        header = <Col>
          <HeaderId {...props} />
          <h4>Process the packets</h4>
        </Col>
        break;

      default:
        break;
    }
  }

  return header;
}

export default Header;
