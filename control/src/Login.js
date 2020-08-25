import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardHeader, Button } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const Login = props => {

  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    const ONE_HOUR = 1000 * 60 * 60;
    let lastSession = JSON.parse(localStorage.getItem(C.LOCAL_STORAGE_KEY));
    if (!lastSession) return;
    let now = (new Date()).getTime();
    if (now - lastSession.time > ONE_HOUR) return
    setAccessCode(lastSession.accessCode);
  }, [])

  const generateAccessCode = () => {
    let chars = R.range(0, C.ACCESS_CODE_LENGTH);
    chars = chars.map(idx => C.ACCESS_CODE_CHARSET.substr(parseInt(Math.random()*C.ACCESS_CODE_CHARSET.length), 1));
    return chars.join('');
    // return 'ASDF';
  };

  const connect = () => {
    props.connect(generateAccessCode());
  };

  const reconnect = () => {
    props.connect(accessCode, true);
  }

  return accessCode ?
    <Row>
      <Col md={8}>
        <Card>
          <CardHeader>
            <Row>
              <Col md={9}>
                <span className="access-code">Previous access code: {accessCode}</span>
              </Col>
              <Col md={3} className="text-center">
                <Button size="lg" color="primary" onClick={reconnect}>Reconnect</Button>
              </Col>
            </Row>
          </CardHeader>
        </Card>
      </Col>
      <Col md={4} className="text-center">
        <Card>
          <CardHeader>
            <Button size="lg" color="primary" onClick={connect}>Create new session</Button>
          </CardHeader>
        </Card>
      </Col>
    </Row> :
    <Row className="access-code-form">
      <Col className="text-center">
        <Card>
          <CardHeader>
            <Button size="lg" color="primary" onClick={connect}>Create new session</Button>
          </CardHeader>
        </Card>
      </Col>
    </Row>
}

export default Login;
