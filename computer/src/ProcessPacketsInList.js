import React, { useState, useEffect } from 'react';
import C from "system-constants";

const R = require('ramda');

const ProcessPacketsInList = props => {

  let packets = Object.values(props.packets);
  packets = packets.filter(packet => packet.to !== props.computerId);
  packets = R.drop(C.PASSABLE_PACKET_COUNT, packets);
  return (
    <table className="packet-extra">
      <thead>
        <tr>
          <th colSpan={6}>Queued packets</th>
        </tr>
        <tr>
          <th>Packet ID</th>
          <th>From</th>
          <th>To</th>
          <th>Packet number</th>
          <th>Out of</th>
          <th>Payload</th>
        </tr>
      </thead>
      <tbody>
      {
        packets.map(packet => {
          return (
            <tr key={packet.key}>
              <td>{packet.key}</td>
              <td>{props.computers[packet.from].name} ({packet.from})</td>
              <td>{props.computers[packet.to].name} ({packet.to})</td>
              <td>{packet.header ? 1 : packet.packetNumber+1}</td>
              <td>{packet.outOf}</td>
              {
                packet.header ? <td>&lt;This is a packet header&gt;</td> : <td>{packet.payload}</td>
              }
            </tr>
          )
        })
      }
      </tbody>
    </table>
  )


}

export default ProcessPacketsInList;
