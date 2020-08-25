const Packet = ({ key, from, to, packetNumber, outOf, payload, holder }) => {
  let packet = {
    key,
    from,
    to,
    packetNumber,
    outOf,
    payload,
    holder
  }

  return {
    getPacket: () => packet,
    setPacket: _packet => packet = _packet,
    moveRight: length => (packet.holder + 1) % length,
    moveLeft: length => packet.holder === 0 ? length - 1 : packet.holder - 1
  }
}

export default Packet
