import React, { useState, useEffect } from 'react';
import { Col, Card, CardHeader, CardBody } from 'reactstrap';

const R = require('ramda');

const MyPackets = props => {

  let packets = Object.values(props.packets);
  packets = packets.filter(packet => packet.to === props.computerId);

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
        </Card>
      </Col>
    )
  });
}

export default MyPackets;
