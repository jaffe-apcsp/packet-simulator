import React, {useState, useEffect} from 'react';
import { Row, Col, Table } from 'reactstrap';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { GrEdit } from 'react-icons/gr';

const R = require('ramda');

const ComputerList = props => {

  const [computerCount, setComputerCount] = useState(0);

  useEffect(() => {
    setComputerCount(props.computers ? (Object.keys(props.computers)).length : 0);
  }, [props.computers]);

  const getStats = (computerId, packets) => {
    let initStats = {
      held: 0,            // Packets held by this computer including those intended for it
      delivered: 0,       // Packet from this computer to another
      toBeDelivered: 0,
      received: 0,        // Packet to this computer from another
      toBeReceived: 0
    }
    let packetKeys = R.keys(packets);
    let stats = packetKeys.reduce((stats, packetKey) => {
      const packetData = packets[packetKey];
      if (packetData.from === computerId) {
        // The packet originated from this computer
        if (packetData.holder === packetData.to) {
          // The packet reached the destination
          stats.delivered++;
        } else {
          // The packet is still out for delivery
          stats.toBeDelivered++;
        }
      } else {
        // The packet does NOT belong to this computer
        if (packetData.to === computerId) {
          if (packetData.holder === computerId) {
            // The packet has reached this computer
            stats.received++;
          } else {
            stats.toBeReceived++;
          }
        }
      }
      if (packetData.holder === computerId) {
        stats.held++;
      }
      return stats;
    }, initStats);
    return stats;
  }

  const remove = evt => {
    let cKey = evt.currentTarget.getAttribute('data-key');
    let packets = R.mapObjIndexed((val, key) => {
      if (val.holder === cKey) {
        val.holder = 'dropped'
      }
      return val;
    }, props.packets);
    props.db.ref(props.accessCode+'/computers/'+cKey).set({});
    props.db.ref(props.accessCode+'/packets').set(packets);
  }

  const unlock = evt => {
    let cKey = evt.currentTarget.getAttribute('data-key');
    props.db.ref(props.accessCode+'/computers/'+cKey+'/locked').set(false);
  }

  const lock = evt => {
    let cKey = evt.currentTarget.getAttribute('data-key');
    props.db.ref(props.accessCode+'/computers/'+cKey+'/locked').set(true);
  }

  const editName = evt => {
    let cKey = evt.currentTarget.getAttribute('data-key');
    let newName = prompt('Change name?', props.computers[cKey].name);
    props.db.ref(props.accessCode+'/computers/'+cKey+'/name').set(newName);
  }

  const computerKeys = R.keys(props.computers);
  let totalNotDelivered = 0, totalDelivered = 0;
  const tbody = computerKeys.map(cKey => {
    const stats = getStats(cKey, props.packets);
    totalNotDelivered += stats.toBeDelivered;
    totalDelivered += stats.delivered;
    let className = props.computers[cKey].locked ? 'sent' : 'unsent';
    return (
      <tr key={cKey} className={className}>
        <td>{cKey}</td>
        <td className="text-left">
          <GrEdit onClick={editName} data-key={cKey} className='edit-name' />{'   '}
          {props.computers[cKey].name}
        </td>
        <td>{stats.held}</td>
        <td>{stats.delivered}</td>
        <td>{stats.toBeDelivered}</td>
        <td>{stats.received}</td>
        <td>{stats.toBeReceived}</td>
        <td className="remove">
          <RiDeleteBin6Line onClick={remove} data-key={cKey} />
          {
            props.computers[cKey].locked ?
              <AiFillUnlock onClick={unlock} data-key={cKey} /> :
              <AiFillLock onClick={lock} data-key={cKey} />
          }
        </td>
      </tr>
    )
  });

  const redistribute = () => {
    let cKeys = Object.keys(props.computers);
    let packets = R.mapObjIndexed((val, key) => {
      if (val.holder === 'dropped') {
        let newCKey = cKeys[parseInt(Math.random()*cKeys.length)];
        val.holder = newCKey;
      }
      return val;
    }, props.packets)
    props.db.ref(props.accessCode+'/packets').set(packets);
  }

  let dropped = 0;
  R.mapObjIndexed(packet => dropped = packet.holder === 'dropped' ? dropped + 1 : dropped, props.packets);

  return (
    <Row className="computer-list">
      <Col>
        <Table size="sm">
          <thead>
            <tr>
              <th rowSpan="2">Computer ({computerCount})</th>
              <th rowSpan="2">Name</th>
              <th rowSpan="2">Packets held</th>
              <th colSpan="2">Packets from me</th>
              <th colSpan="2">Packets to me</th>
              <th rowSpan="2">Remove</th>
            </tr>
            <tr>
              <th>Delivered</th>
              <th>To go</th>
              <th>Received</th>
              <th>To go</th>
            </tr>
          </thead>
          <tbody>
            {tbody.length > 0 ? tbody : <tr><td colSpan="8" className="computer-list-waiting">Waiting for computers</td></tr>}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={8} className="text-left">
                Total packets delivered: {totalDelivered}<br />
                Total packets not delivered: {totalNotDelivered}<br />
                {/*Total dropped packets: {dropped}  {*/}
                {/*  dropped > 0 ?*/}
                {/*    <span className="link" onClick={redistribute}>Redistribute</span> :*/}
                {/*    null*/}
                {/*}*/}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Col>
    </Row>
  );
}

export default ComputerList;
