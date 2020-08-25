import React from 'react';
import { Col, Card, CardHeader, CardBody } from 'reactstrap';

const PacketHeader = props => {

  return (
    <Col md={3} key={props.header.key+'-packet'}>
      <Card className="packet">
        <CardHeader className="packet-header">
          <span>Packet Header</span>
        </CardHeader>
        <CardBody>
          <span>{props.header.outOf} packets in message</span>
        </CardBody>
      </Card>
    </Col>
  )
}

export default PacketHeader;
