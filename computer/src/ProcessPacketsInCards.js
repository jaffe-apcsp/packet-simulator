import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const ProcessPacketsInCards = props => {

  const move = evt => {
    props.passTriggered();
    const packetKey = evt.currentTarget.getAttribute('packet-key')
    const moveToComputerId = evt.currentTarget.getAttribute('move-to');
    props.db.ref(props.accessCode + '/packets/' + packetKey).update({holder: moveToComputerId});
  }

  const keep = evt => {
    props.passTriggered();
    const packetKey = evt.currentTarget.getAttribute('packet-key')
    props.db.ref(props.accessCode + '/packets/' + packetKey).update({locked: true});
  }

  let packets = Object.values(props.packets);
  packets = packets.filter(packet => packet.to !== props.computerId);
  packets = R.take(C.PASSABLE_PACKET_COUNT, packets);
  return packets.map(packet => {
    return (
      <Col md={4} key={packet.key} className="top-spacer">
        <Card>
          <CardHeader>
            <h4>Packet {packet.key}</h4>
          </CardHeader>
          <CardBody>
            <table className="process-table">
              <tbody>
              <tr>
                <td>From:</td>
                <td>{props.computers[packet.from].name} ({packet.from})</td>
              </tr>
              <tr>
                <td>To:</td>
                <td>{props.computers[packet.to].name} ({packet.to})</td>
              </tr>
              <tr>
                <td>Packet number:</td>
                <td>{packet.header ? 1 : packet.packetNumber + 1}</td>
              </tr>
              <tr>
                <td>Out of:</td>
                <td>{packet.outOf}</td>
              </tr>
              {
                packet.header ?
                  <tr>
                    <td colSpan={2} className="packet-header">This is a packet header</td>
                  </tr> :
                  <tr>
                    <td>Payload:</td>
                    <td>{packet.payload}</td>
                  </tr>
              }
              </tbody>
            </table>
          </CardBody>
          <CardFooter>
            <Row>
              {
                packet.to === props.computerId ? null :
                  <Col md={6}>
                    <Button className="text-left"
                            size="sm"
                            onClick={move}
                            disabled={!props.allowPass}
                            packet-key={packet.key}
                            move-to={props.leftComputerId}
                            color="primary">{'< MOVE LEFT'}</Button>
                  </Col>
              }
              {
                packet.to !== props.computerId ? null :
                  <Col md={{size: 6, offset: 3}}>
                    <Button className="text-center"
                            size="sm"
                            disabled={!props.allowPass}
                            onClick={keep}
                            packet-key={packet.key}
                            color="success">KEEP!</Button>
                  </Col>
              }
              {/*{*/}
              {/*  packet.to === props.computerId ? null :*/}
              {/*    <Col md={6}>*/}
              {/*      <Button className="text-right"*/}
              {/*              size="sm"*/}
              {/*              disabled={!props.allowPass}*/}
              {/*              onClick={move}*/}
              {/*              packet-key={packet.key}*/}
              {/*              move-to={props.rightComputerId}*/}
              {/*              color="primary">{'MOVE RIGHT >'}</Button>*/}
              {/*    </Col>*/}
              {/*}*/}
            </Row>
          </CardFooter>
        </Card>
      </Col>
    )
  });
}

export default ProcessPacketsInCards;
