import C from 'system-constants';
const R = require('ramda');

// state:           Incoming state
// action.type:     (str) Action to take
// action.<prop>:  (any) Properties of the message payload
const reducer = (_state, action) => {
  let state = R.clone(_state);

  switch (action.type) {
    case C.HYDRATE:
      state = action.val;
      break

    case C.SET_ACCESS_CODE:
      state.accessCode = action.accessCode;
      break;

    default: break;
  }


  return state;
}

export default reducer;
