const { App } = require('@slack/bolt');
const ewelink = require('ewelink-api');

const config = {
  slack: {
    appToken: 'xapp-1-...',
    token: 'xoxb-...',
    targetUsername: '',
    busyStatuses: ['In a meeting', 'In a huddle', 'in_a_huddle', 'On a call'],
    events: {
      USER_STATUS_CHANGED: 'user_status_changed',
      USER_HUDDLE_CHANGED: 'user_huddle_changed',
    }
  },
  eWeLink: {
    email: '',
    password: '',
    at: '',
    apiKey: '',
    region: 'eu',
    targetDeviceName: 'BusyLight',
    targetDeviceId: '',
  }
};

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

// TODO: MISSING 'Google Meet call start/end' triggers
(async () => {
  const eWeLinkConnection = new ewelink({
    // at: config.eWeLink.at,
    // apiKey: config.eWeLink.apiKey,
    email: config.eWeLink.email,
    password: config.eWeLink.password,
    region: config.eWeLink.region,
  });

  /* get all devices */
  // const devices = await eWeLinkConnection.getDevices();
  // console.log(devices);
  // console.log(devices.find(d => d.name === config.eWeLink.targetDeviceName));

  // const status = await connection.getDevicePowerState(config.eWeLink.targetDeviceId);
  // console.log(status);

  const setBusyMode = async (mode) => {
    const status = await eWeLinkConnection.setDevicePowerState(config.eWeLink.targetDeviceId, mode ? 'on' : 'off');
    console.log('BusyMode: (provided / device)', mode, '/' , status.state, 'at', now());
  }

  const slackConnection = new App({
    token: config.slack.token,
    appToken: config.slack.appToken,
    socketMode: true,
  });
  await slackConnection.start();
  console.log('⚡️ Slack BOT started ⚡️');

  // Slack events
  slackConnection.event(config.slack.events.USER_STATUS_CHANGED, async ({ event }) => {
    if (event.user.profile.real_name === config.slack.targetUsername) {
      console.log(config.slack.events.USER_STATUS_CHANGED, event.user.profile.status_text);
      setBusyMode(config.slack.busyStatuses.some(bs => event.user.profile.status_text.toLowerCase().includes(bs.toLowerCase())));
    }
  });

  slackConnection.event(config.slack.events.USER_HUDDLE_CHANGED, async ({ event }) => {
    if (event.user.profile.real_name === config.slack.targetUsername) {
      console.log(config.slack.events.USER_HUDDLE_CHANGED, event.user.profile.huddle_state);
      setBusyMode(config.slack.busyStatuses.some(bs => event.user.profile.huddle_state.toLowerCase().includes(bs.toLowerCase())));
    }
  });
})();