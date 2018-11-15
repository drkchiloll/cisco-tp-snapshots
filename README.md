# Cisco Telepresence Endpoint Snapshots API

Take snapshots from your Cisco Teleprsence endpoint when Remote Monitoring Option is installed.

### Install

```
npm i cisco-tp-snapshots
```

### Usage

```javascript
// If using Self-Signed CERT on Endpoints do this...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { TpEndpoint } = require('cisco-tp-snapshots');

const ce = new TpEndpoint({
  host: 'ip/hostname',
  username: 'user',
  password: 'pass'
});

// Verify Endpoint has the Feature
ce.verifyTpEndpoint().then(enabled => {
  if(enabled) {
    return ce.getVideoInputs().then(inputs => {
      // [{sourceId: '1', type: 'inputType <camera|hdmi|etc>'}]
      return ce.takeSnapshot(inputs[0].sourceId).then(img => {
        // What to do with the Image ?
        fs.writeFile('./myimg.jpeg', img, {encoding: 'base64'}, (e) => {})
      })
    })
  }
})
```
### Contributing

This module is written using Typescript. Clone this Module to submit PRs or continue development as your own repository.

```
npm install
# To Build for PROD
npm run build
# Development (watches all ts files in the src directory and builds on change
npm run dev
```

### License
MIT