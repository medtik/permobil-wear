import { Injectable } from 'injection-js';
import { Kinvey } from 'kinvey-nativescript-sdk';
import { Log } from '../utils';

@Injectable()
export class SensorDataService {
  private _datastore = Kinvey.DataStore.collection<any>('WatchData');

  constructor() {
    Log.D('SensorDataService constructor...');
  }

  async saveRecord(record) {
    await this._datastore.save(record);
    await this._datastore.push();
  }
}
