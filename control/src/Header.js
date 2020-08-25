import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const Header = props => {

  let header;
  switch (props.gameState) {
    case C.STANDBY:
      header = <span>Access code: {props.accessCode}</span>;
      break;

    case C.ADDRESS_WRITE:
      header = <span>Write your message</span>;
      break;

    case C.PLAY:
      header = <span>Process packets</span>;
      break;

    default:
      header = <span>Please wait...</span>;
      break;
  }

  return (
    <Row className="access-code">
      <Col md={2}>
        <Button block
                color="primary"
                size="lg"
                disabled={props.gameState === C.STANDBY}
                onClick={props.back}>Back</Button>
      </Col>
      <Col md={8}>
        {header}
      </Col>
      <Col md={2}>
        <Button block
                color="primary"
                size="lg"
                disabled={!props.computers || R.keys(props.computers).length < 2}
                onClick={props.next}>Next</Button>
      </Col>
    </Row>
  );
}

export default Header;
