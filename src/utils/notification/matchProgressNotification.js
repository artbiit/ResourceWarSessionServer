import makeNotification from './makeNotification.js';
import configs from '../../configs/configs.js';
const { PacketType } = configs;

export default (payload, userToken) => {
  makeNotification(PacketType.MATCH_PROGRESS_NOTIFICATION, '', payload, [userToken]);
};
