import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Label, Input } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const Login = props => {

  const [accessCode, setAccessCode] = useState('');
  const [name, setName] = useState('');
  const [computerId, setComputerId] = useState('');
  const [enableRestoreSession, setEnableRestoreSession] = useState(false);
  const [enableLogin, setEnableLogin] = useState(false);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem(C.LOCAL_STORAGE_KEY));
    let now = (new Date()).getTime();
    if (data && (data.timestamp + C.FIVE_MINUTES > now)) {
      setAccessCode(data.accessCode);
      setName(data.name);
      setComputerId(data.computerId);
      setEnableRestoreSession(true);
    } else {
      setAccessCode('');
      setName('');
      setComputerId('');
      setEnableRestoreSession(false);
    }
  }, [])

  useEffect(() => {
    setEnableLogin(accessCode.length > 0 && name.length > 0);
  }, [accessCode, name])

  const generateId = () => {
    let chars = R.range(0, C.COMPUTER_ID_LENGTH);
    chars = chars.map(idx => C.COMPUTER_ID_CHARSET.substr(parseInt(Math.random()*C.COMPUTER_ID_CHARSET.length), 1));
    return chars.join('');
  };

  const onChangeAccessCode = evt => {
    if (evt.currentTarget.value.match(/\d/)) return;
    setAccessCode(evt.currentTarget.value.toUpperCase());
  };

  const onChangeName = evt => {
    setName(evt.currentTarget.value.toUpperCase());
  };

  const onClick = () => {
    let computerId = generateId();
    let now = (new Date()).getTime();
    localStorage.setItem(C.LOCAL_STORAGE_KEY, JSON.stringify({accessCode, name, computerId, timestamp: now}));
    props.join({accessCode, name, computerId, rejoin: false});
  }

  const rejoin = () => {
    let now = (new Date()).getTime();
    localStorage.setItem(C.LOCAL_STORAGE_KEY, JSON.stringify({accessCode, name, computerId, timestamp: now}));
    props.join({accessCode, name, computerId, rejoin: true});
  }

  return (
    <>
      <Row className="access-code-form">
        <Col md={{size:4, offset:2}} xs={6}>
          <Label for="accessCode" className="text-right">ACCESS CODE:</Label>
        </Col>
        <Col md={2} xs={6}>
          <Input type="text"
                 name="accessCode"
                 id="accessCode"
                 value={accessCode}
                 onChange={onChangeAccessCode} />
        </Col>
      </Row>
      <Row className="access-code-form">
        <Col md={{size:4, offset:2}} xs={6}>
          <Label for="accessCode" className="text-right">NAME:</Label>
        </Col>
        <Col md={4} xs={6}>
          <Input type="text"
                 name="accessCode"
                 id="accessCode"
                 value={name}
                 onChange={onChangeName} />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button color="primary"
                  className="join-button"
                  disabled={!enableLogin}
                  onClick={onClick}>JOIN THE NETWORK</Button>
          {
            enableRestoreSession ?
              <Button color="primary" className="join-button" onClick={rejoin}>RESTORE SESSION</Button> : null
          }
        </Col>
      </Row>
    </>
  );
}

export default Login;
