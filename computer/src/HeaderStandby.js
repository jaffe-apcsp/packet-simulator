import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import HeaderId from './HeaderId';
import HeaderRemoved from "./HeaderRemoved";
import C from "system-constants";

const HeaderStandby = props => {

  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setRemoved(!props.computers || props.computers[props.computerId] === undefined);
  }, [props.computerId, props.computers]);

  useEffect(() => {
    if (!removed) return;
    localStorage.removeItem(C.LOCAL_STORAGE_KEY);
  }, [removed])

  return (
    <Row className="access-code">
      {
        removed ?
          <Col>
            <HeaderRemoved />
          </Col> :
          <Col>
            <HeaderId {...props} />
            <h4>Waiting for computers to join the network...</h4>
          </Col>
      }
    </Row>
  );
}

export default HeaderStandby;
