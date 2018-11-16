import * as jsxapi from 'jsxapi';
import * as Promise from 'bluebird';
import axios, { AxiosInstance } from 'axios';

export class TpEndpoint {
  private ce: any;
  private ceConfig: any;
  private apiRequest: AxiosInstance;
  constructor(params: any) {
    this.ceConfig = {
      host: params.host,
      username: params.username,
      password: params.password
    };
    this.apiRequest = axios.create({
      baseURL: `https://${params.host}`,
      auth: { username: params.username, password: params.password },
      adapter: require('axios/lib/adapters/http')
    })
  }

  private connect() {
    return new Promise((resolve, reject) => {
      this.ce = jsxapi.connect(`ssh://${this.ceConfig.host}`, {
        username: this.ceConfig.username,
        password: this.ceConfig.password,
        readyTimeout: 7500,
        keepaliveinterval: 6675
      });
      this.ce.on('ready', () => resolve());
      this.ce.on('error', e => reject(e));
    })
  }

  verifyTpEndpoint() {
    return this.connect()
      .then(() => this.ce.command('SystemUnit OptionKey List', {}))
      .then((optionsList) => {
        this.ce.close();
        const keys = optionsList.OptionKey;
        return Promise.filter(keys, (k: any) => k.Type === 'RemoteMonitoring')
      }).then(rm => rm.length === 1 ? true: false)
  }

  private wakeupTpEndpoint() {
    return this.connect()
      .then(() => this.ce.command('Standby Deactivate', {}))
      .then(() => this.ce.close());
  }

  getVideoInputs() {
    return this.connect()
      .then(() => this.ce.status.get('Video Input'))
      .then((inputs: any) => {
        this.ce.close();
        return Promise.filter(inputs.Connector, (input:any) => input.Connected === 'True')
          .map(inputs => {
            return {
              sourceId: inputs.SourceId,
              type: inputs.Type
            }
          })
      })
  }

  takeSnapshot(SourceId) {
    const url = '/websnapshot/get_b64';
      return this.wakeupTpEndpoint().then(() => {
          return this.apiRequest.get(url, {
              auth: this.ceConfig,
              params: { SourceType: 'localInput', SourceId }});
      }).then(resp => resp.data.data);
  }

}
