// If you are using a Self Signed Certificate
// For the Endpoint Use this...
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { TpEndpoint } = require('cisco-tp-snapshots');
const fs = require('fs');

const ce = new TpEndpoint({
  host: 'yours',
  username: 'user',
  password: 'pass'
});
// Verify License for Snapshots
return ce.verifyTpEndpoint().then(enabled => {
  if(enabled) {
    return ce.getVideoInputs();
  } else {
    return null;
  }
}).then(inputs => {
  if(Array.isArray(inputs)) {
    // Which Source Input do you want to Use to Take a Snapshot
    return ce.takeSnapshot(inputs[0].sourceId)
      .then(img => fs.writeFileSync('./myImage.jpeg', img, { encoding: 'base64' }));
  }
})