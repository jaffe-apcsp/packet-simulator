import React, { useState, useEffect } from 'react';
import ProcessPacketsInCards from "./ProcessPacketsInCards";
import MyPackets from './MyPackets';
import ProcessPacketsInList from "./ProcessPacketsInList";
import Message from "./Message";
import { Row, Col, Button } from 'reactstrap';
import C from "system-constants";

const R = require('ramda');

const ProcessHeader = props => {

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
    let idx = props.dbState.ring.findIndex(id => id === props.appState.computerId);
    if (idx < 0) return;
    let leftIdx = idx === 0 ? props.dbState.ring.length - 1 : idx - 1;
    let rightIdx = idx + 1 === props.dbState.ring.length ? 0 : idx + 1;
    setLeftComputerId(props.dbState.ring[leftIdx]);
    setRightComputerId(props.dbState.ring[rightIdx]);
  }, [props.dbState.ring, props.appState.computerId])

  const allPackets = Object.values(props.dbState.packets);
  const packetsImHolding = allPackets.filter(packet => packet.holder === props.appState.computerId);

  let view = null;
  if (activeTab === 'process') {
    view = (
      <>
        <ProcessPacketsInCards db={props.db}
                               computers={props.dbState.computers}
                               computerId={props.appState.computerId}
                               accessCode={props.dbState.accessCode}
                               allowPass={allowPass}
                               packets={packetsImHolding}
                               passTriggered={passTriggered}
                               leftComputerId={leftComputerId}
                               rightComputerId={rightComputerId} />
        <ProcessPacketsInList computers={props.dbState.computers}
                              computerId={props.appState.computerId}
                              packets={packetsImHolding} />
      </>
    )
  } else if (activeTab === 'mine') {
    view = <MyPackets computers={props.dbState.computers}
                      computerId={props.appState.computerId}
                      packets={packetsImHolding} />
  }

  return (
    <>
      <Row>
        <Col md={4}>
          {
            activeTab === 'process' ? <h4 className="neighbors">{props.dbState.computers[leftComputerId] ? "On your left is "+props.dbState.computers[leftComputerId].name : null}</h4> : null
          }
        </Col>
        <Col md={4} className="text-center">
        {
          activeTab === 'mine' ?
            <Button data-key="process" onClick={switchView} color="primary">Show packets to be passed</Button> :
            <Button data-key="mine" onClick={switchView} color="primary">Show packets sent to me</Button>
        }
        </Col>
        <Col md={4}>
          {
            activeTab === 'process' ? <h4 className="neighbors">{props.dbState.computers[rightComputerId] ? "On your right is "+props.dbState.computers[rightComputerId].name : null}</h4> : null
          }
        </Col>
      </Row>
      {
        activeTab === 'mine' ?
          <Row className="top-spacer">
            <Col>
              <span className="received-message-label">
                Received message:&nbsp;
              </span>
              <Message computers={props.dbState.computers}
                                           computerId={props.appState.computerId}
                                           packets={packetsImHolding} />
            </Col>
          </Row> : null
      }
      <Row className="top-spacer">
        {view}
      </Row>
    </>
  );
}

export default ProcessHeader;
