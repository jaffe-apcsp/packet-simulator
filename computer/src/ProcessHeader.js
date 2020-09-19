import React, { useState, useEffect } from 'react';
import ProcessPackets from "./ProcessPackets";
import MyPackets from './MyPackets';
import ProcessPacketsInList from "./ProcessPacketsInList";
import { Row, Col, Button } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const Process = props => {

  const [activeTab, setActiveTab] = useState('process');
  const [leftComputerId, setLeftComputerId] = useState(null);
  const [rightComputerId, setRightComputerId] = useState(null);
  const [allowPass, setAllowPass] = useState(true);

  const switchView = evt => {
    setActiveTab(evt.currentTarget.getAttribute('data-key'));
  }

  const passTriggered = () => {
    setAllowPass(false);
    setTimeout(() => setAllowPass(true), C.WAIT_TIME_AFTER_PASS);
  }

  useEffect(() => {
    let idx = props.ring.findIndex(id => id === props.computerId);
    if (idx < 0) return;
    let leftIdx = idx === 0 ? props.ring.length - 1 : idx - 1;
    let rightIdx = idx + 1 === props.ring.length ? 0 : idx + 1;
    setLeftComputerId(props.ring[leftIdx]);
    setRightComputerId(props.ring[rightIdx]);
  }, [props.ring, props.computerId])

  const allPackets = Object.keys(props.packets).map(id => props.packets[id]);
  const packetsImHolding = R.filter(packet => packet.holder === props.computerId, allPackets);
  const [myPackets, othersPackets] = R.partition(packet => packet.locked && packet.to === props.computerId, packetsImHolding);

  let view = null;
  if (activeTab === 'process') {
    view = (
      <>
        <ProcessPackets {...props}
                        allowPass={allowPass}
                        passTriggered={passTriggered}
                        othersPackets={othersPackets}
                        leftComputerId={leftComputerId}
                        rightComputerId={rightComputerId} />
        <ProcessPacketsInList {...props}
                              othersPackets={othersPackets} />
      </>
    )
  } else if (activeTab === 'mine') {
    view = <MyPackets {...props}
                      myPackets={myPackets} />
  }

  let messagePackets = myPackets.filter(p => !p.header);
  messagePackets = messagePackets.sort((a,b) => a.packetNumber < b.packetNumber ? -1 : 1)
  const message = messagePackets.reduce((str, packet) => packet.header ? str : str+packet.payload, '');

  return (
    <>
      <Row>
        <Col md={4}>
          {
            activeTab === 'process' ? <h4 className="neighbors">{props.computers[leftComputerId] ? "On your left is "+props.computers[leftComputerId].name : null}</h4> : null
          }
        </Col>
        <Col md={4} className="text-center">
        {
          activeTab === 'mine' ?
            <Button data-key="process" onClick={switchView} color="primary">Show my stack of packets to pass</Button> :
            <Button data-key="mine" onClick={switchView} color="primary">Show packets sent to me that I've kept</Button>
        }
        </Col>
        <Col md={4}>
          {
            activeTab === 'process' ? <h4 className="neighbors">{props.computers[rightComputerId] ? "On your right is "+props.computers[rightComputerId].name : null}</h4> : null
          }
        </Col>
      </Row>
      {
        activeTab === 'mine' ? <Row className="top-spacer"><Col><span className="received-message">Received message: {message}</span></Col></Row> : null
      }
      <Row className="top-spacer">
        {view}
      </Row>
    </>
  );
}

export default Process;
