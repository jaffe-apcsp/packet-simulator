import React from 'react';

const HeaderId = props => {

  return <h3>Computer ID: {props.appState.computerId} | Name: {props.dbState.computers[props.appState.computerId].name}</h3>;
}

export default HeaderId;
