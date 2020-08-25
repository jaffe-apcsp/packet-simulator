import React from 'react';
import { Col, Card, CardHeader, CardBody } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const PacketDeck = props => {

  let packetCards = props.packets.map((p, idx) => {
    if (idx === 0) return null;
    let chars = R.range(0, C.PACKET_LENGTH);
    chars = chars.map(idx => {
      return idx < p.payload.length ?
        <td width="20%" key={p.key + '-' + idx}>
          <div className="packet-char">
            {p.payload.substr(idx, 1)}
          </div>
        </td> :
        <td width="20%" key={p.key + '-' + idx}>&nbsp;</td>
    })

    return (
      <Col md={3} key={p.key+'-packet'}>
        <Card className="packet">
          <CardHeader className="packet-header">
            <span>Packet {p.packetNumber+1} of {p.outOf}</span>
          </CardHeader>
          <CardBody>
            <table className="packet-table">
              <thead></thead>
              <tbody>
                <tr>
                  {chars}
                </tr>
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col>
    )
  })

  return packetCards;
}

export default PacketDeck;
