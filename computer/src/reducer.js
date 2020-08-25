import C from 'system-constants';
const R = require('ramda');

// state:           Incoming state
// action.type:     (str) Action to take
// action.<prop>:  (any) Properties of the message payload
const reducer = (_state, action) => {
  let state = R.clone(_state || {});

  switch (action.type) {
    case C.JOIN:
      state.computerId = action.computerId
      state.accessCode = action.accessCode;
      state.name = action.name;
      break

    case C.REJOIN:
      break;

    default: break;
  }


  return state;
}

export default reducer;
