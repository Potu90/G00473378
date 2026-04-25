import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  constructor(private storage: Storage) {
    this.init();
  }

  //Initialize the storage. Must be called before using set or get
  async init() {
    await this.storage.create();
  }

  //Save a value in storage with a key
  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  //Retrieve a value from storage by its key
  async get(key: string) {
    return await this.storage.get(key);
  }
}