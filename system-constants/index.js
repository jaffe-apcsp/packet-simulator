// Game states
exports.STANDBY = 0;
exports.WRITE_MESSAGES = 1;
exports.PLAY = 2;

exports.ACCESS_CODE_LENGTH = 4;
exports.ACCESS_CODE_CHARSET = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
exports.PACKET_ID_CHARSET = '0123456789';
exports.PACKET_ID_LENGTH = 6;

exports.SET_ACCESS_CODE = 'setAccessCode';
exports.MOVE_RIGHT = 'moveRight';
exports.MOVE_LEFT = 'moveLeft';
exports.HYDRATE = 'hydrate';
exports.NEXT = 'next';

exports.COMPUTER_ID_LENGTH = 6;
exports.COMPUTER_ID_CHARSET = '0123456789';

exports.JOIN = 'join';
exports.REJOIN = 'rejoin';
exports.SET_COMPUTER_ID = 'setComputerId';

exports.LOCAL_STORAGE_KEY = 'packet-demo';
exports.FIVE_MINUTES = 1000 * 60 * 5;

exports.MAX_MESSAGE_LENGTH = 70;
exports.PACKET_LENGTH = 5;

exports.PASSABLE_PACKET_COUNT = 6;

exports.WAIT_TIME_AFTER_PASS = 1000;



