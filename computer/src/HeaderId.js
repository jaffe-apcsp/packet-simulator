import React from 'react';

const HeaderId = props => {

  return <h3>Computer ID: {props.appState.computerId} | Name: {props.appState.name}</h3>;
}

export default HeaderId;
