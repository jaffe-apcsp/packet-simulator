import React from 'react';
import { Row, Col } from 'reactstrap';
import packageJson from '../package.json';

const Footer = props => {

  return (
    <Row className="footer">
      <Col md={6} className="text-left">
        <span>APCSP Packet Demonstration</span>
      </Col>
      <Col md={6} className="text-right">
        <span>Version {packageJson.version}</span>
      </Col>
    </Row>
  );
}

export default Footer;
