import C from 'system-constants';

const initState = accessCode => ({
  accessCode,
  gameState: C.STANDBY,
});

export default initState;
