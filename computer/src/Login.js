import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Label, Input, Form, FormGroup } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const Login = props => {

  const [accessCode, setAccessCode] = useState('');
  const [name, setName] = useState('');
  const [enableLogin, setEnableLogin] = useState(false);
  const [prevComputerId, setPrevComputerId] = useState('');

  // useEffect(() => {
  //   let prevComputerId = JSON.parse(localStorage.getItem(C.LOCAL_STORAGE_KEY));
  //   setPreviousSession(prevComputerId);
  // }, [])
  //
  useEffect(() => {
    setEnableLogin(accessCode.length > 0 && ((name.length > 0) || (prevComputerId.length > 0)));
  }, [accessCode, name, prevComputerId])

  const generateId = () => {
    let chars = R.range(0, C.COMPUTER_ID_LENGTH);
    chars = chars.map(idx => C.COMPUTER_ID_CHARSET.substr(parseInt(Math.random()*C.COMPUTER_ID_CHARSET.length), 1));
    return chars.join('');
  };

  const onChangeAccessCode = evt => {
    if (evt.currentTarget.value.match(/\d/)) return;
    setAccessCode(evt.currentTarget.value.toUpperCase());
  };

  const onChangeRejoinId = evt => {
    setPrevComputerId(evt.currentTarget.value);
  }

  const onChangeName = evt => {
    setName(evt.currentTarget.value.toUpperCase());
  };

  const onClick = () => {
    let computerId = generateId();
    let timestamp = (new Date()).getTime();
    // let id = {accessCode, name, computerId, timestamp};
    // localStorage.setItem(C.LOCAL_STORAGE_KEY, JSON.stringify(id));
    props.join({accessCode, name, computerId: prevComputerId ? prevComputerId: computerId});
  }

  // const rejoin = () => {
  //   props.rejoin(prevComputerId);
  // }
  //
  // const now = (new Date()).getTime();

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
                 className={props.invalidSession ? 'invalid-session' : ''}
                 value={accessCode}
                 onChange={onChangeAccessCode} />
          {
            props.invalidSession ? <span className="error">Invalid session ID</span> : null
          }
        </Col>
      </Row>
      <Row className="access-code-form">
        <Col md={{size:4, offset:2}} xs={6}>
          <Label for="accessCode" className="text-right">YOUR NAME:</Label>
        </Col>
        <Col md={4} xs={6}>
          <Input type="text"
                 name="name"
                 id="name"
                 value={name}
                 onChange={onChangeName} />
        </Col>
      </Row>
      <Row className="access-code-form">
        <Col md={{size:4, offset:2}} xs={6}>
          <Label for="computerId" className="text-right">REJOIN AS ID:</Label>
        </Col>
        <Col md={4} xs={6}>
          <Input type="text"
                 name="computerId"
                 id="computerId"
                 value={prevComputerId}
                 onChange={onChangeRejoinId} />
        </Col>
      </Row>
      <Row>
        <Col className="text-center" md={{size:6, offset: 3}}>
          <Button color="primary"
                  block
                  className="join-button"
                  disabled={!enableLogin}
                  onClick={onClick}>JOIN (OR REJOIN) THE NETWORK</Button>
        </Col>
      </Row>
    </>
  );
}

export default Login;
