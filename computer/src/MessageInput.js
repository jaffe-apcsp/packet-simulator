import React, { useState, useEffect } from 'react';
import PacketDeck from "./PacketDeck";
import PacketHeader from './PacketHeader';
import { Label, Row, Col, Button } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const MessageInput = props => {

  const [message, setMessage] = useState('');
  const [packets, setPackets] = useState([]);

  const onChange = evt => {
    if (evt.currentTarget.value.length > C.MAX_MESSAGE_LENGTH) return;
    setMessage(evt.currentTarget.value.toUpperCase());
  }

  const generatePacketId = () => {
    let chars = R.range(0, C.PACKET_ID_LENGTH);
    chars = chars.map(idx => C.PACKET_ID_CHARSET.substr(parseInt(Math.random()*C.PACKET_ID_CHARSET.length), 1));
    return chars.join('');
  };

  useEffect(() => {
    const packetTextArray = message.match(new RegExp('.{1,' + C.PACKET_LENGTH + '}', 'g'));
    if (!packetTextArray) return;
    let packetArray = packetTextArray.map((packetText, idx) => {
      return {
        key: generatePacketId(),
        header: false,
        from: props.appState.computerId,
        to: props.dbState.computers[props.appState.computerId].to,
        packetNumber: idx+1,
        outOf: packetTextArray.length+1,
        payload: packetText,
        holder: props.appState.computerId,
        locked: false
      }
    });
    let packetHeader = {
      key: generatePacketId(),
      header: true,
      from: props.appState.computerId,
      to: props.dbState.computers[props.appState.computerId].to,
      outOf: packetTextArray.length+1,
      holder: props.appState.computerId,
      locked: false
    }
    setPackets(R.concat([packetHeader], packetArray));
  }, [message, props.dbState.computers, props.appState.computerId]);

  const send = () => {
    props.db.ref(props.dbState.accessCode+'/computers/'+props.appState.computerId+'/locked').set(true);
    let packetObjs = packets.reduce((obj, packet) => {
      obj[packet.key] = packet;
      return obj;
    }, {});
    props.db.ref(props.dbState.accessCode+'/packets').update(packetObjs);
  }

  return (
    <>
      <Row className="message">
        <Col md={12}>
          <Label>Enter your message to {props.dbState.computers[props.dbState.computers[props.appState.computerId].to].name} below ({C.MAX_MESSAGE_LENGTH - message.length} character{C.MAX_MESSAGE_LENGTH - message.length === 1 ? '' : 's'} left)</Label>
        </Col>
      </Row>
      <Row className="message">
        <Col md={{size: 7, offset: 1}}>
          <textarea value={message} onChange={onChange} className={props.dbState.computers[props.appState.computerId].locked ? 'message-sent' : ''} />
        </Col>
        <Col md={{size: 2, offset: 1}}>
          {
            props.dbState.computers[props.appState.computerId].locked ?
              <Button block color="success">Message sent!</Button> :
              <Button block color="primary" onClick={send} disabled={message.length === 0}>Send</Button>
          }
        </Col>
      </Row>
      <Row>
        {
          packets.length > 0 ? <PacketHeader header={packets[0]} /> : null
        }
        <PacketDeck packets={packets} />
      </Row>
    </>
  );
}

export default MessageInput;
