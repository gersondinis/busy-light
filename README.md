# DIY BusyLight
> It syncs Slack status with your eWeeLink IOT devices. (eg. 5$ Sonoff Wifi Switch)
---
### Instructions:

1. Add your `IOT device` to an [eWeeLink account](https://ewelink.cc).

2. Create a `Slack app` with the following configurations:
   -  Socket Mode on
   -  Add App-Level Token with 'connections:write'
   -  OAuth & Permissions > create OAuth token 'xoxb-...'
   -  Scopes: 
      -  Bot Token Scopes: ['calls:read', 'chat:write', 'dnd:read']
      -  User Token Scopes: ['users:read']
   -  Event Subscriptions > Subscribe to this events on behalf of users:
      -  user_huddle_changed
      -  user_status_changed
   -  Install app
3. Fill `config` variable in index.js.
4. Run: `yarn && node index.js`

