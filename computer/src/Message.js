import React, { useState, useEffect } from 'react';
import C from "system-constants";

const R = require('ramda');

const Message = props => {

  let packets = props.packets.filter(packet => packet.to === props.computerId);

  let headerPacket = R.find(packet => packet.header, packets);
  let outOf = headerPacket ? headerPacket.outOf : null;
  let packetsInOrder = R.clone(packets);
  if (outOf) {
    packetsInOrder = R.range(1, outOf);
    packetsInOrder = packetsInOrder.map(seq => R.find(packet => packet.packetNumber === seq, packets));
  }
  let message = packetsInOrder.reduce((str, packet) => {
    if (packet) {
      return str + packet.payload;
    } else {
      return str + R.range(0, C.PACKET_LENGTH).map(idx => '_').join(' ');
    }
  }, '');

  return <span className="received-message">{message}</span>;
}

export default Message;
