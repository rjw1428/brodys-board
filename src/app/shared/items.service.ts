import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Item } from './item.module'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ItemsService {
  imgPath: string[];
  items: AngularFireList<any>
  selectedItem: Item = new Item();
  selectedItemIndex: number;
  margin: number;
  constructor(private firebaseData: AngularFireDatabase) {
  }

  getData() {
    this.items = this.firebaseData.list('draftList', ref => ref.orderByChild('order'))
    return this.items;
  }

  getProperties() {
    return this.firebaseData.list('properties')
  }

  resetRefreshOnLoad(screenKey: string) {
    this.firebaseData.list('status').update(screenKey, {
      refresh: false
    })
  }

  forceRefresh() {
    let screenList = ['1', '2']
    screenList.forEach(screen => {
      this.firebaseData.list('status').update(screen, {
        refresh: true
      })
    });
  }

  checkForRefresh(screenKey: string) {
    this.firebaseData.list('status').snapshotChanges().forEach(screens => {
      screens.forEach(property => {
        let key = property.key
        let val: { refresh: boolean } = property.payload.toJSON() as any
        if (key == screenKey) {
          if (val.refresh) {
            window.location.reload(true)
          }
        }
      })
    })
  }

  setPopup(status, screenNum) {
    this.firebaseData.list('status').update(screenNum, {
      joke: status,
      jokeTIme: this.timestamp()
    })
  }

  checkForPopup() {
    return this.firebaseData.list('status').snapshotChanges()
  }

  setLastRefreshData(screen: string) {
    var date = new Date()
    this.firebaseData.list('status').update(screen, {
      lastRefreshed: date.toLocaleDateString() + " - " + date.toLocaleTimeString(),
      agent: navigator.userAgent,
    })
    console.log("LAST REFRESH: " + date)
  }

  setScreenResolution(screen: string, width: number, height: number) {
    this.firebaseData.list('status').update(screen, {
      screenWidth: width,
      screenHeight: height
    })
  }

  onClick(item: Item) {
    //console.log(item)
  }

  insertItem(item: Item) {
    this.items.push({
      company: item.company,
      order: item.order,
      beer: item.beer,
      note: item.note,
      abv: item.abv,
      imgUrl: item.imgUrl,
      available: item.available,
      happyHour: item.happyHour,
      lastModified: this.timestamp()
    });
  }


  setMissingIcon(company: string, filename: string) {
    this.firebaseData.list('error/').push({
      company: company,
      filename: filename,
      timestamp: this.timestamp()
    })
  }

  deleteItem($key: string) {
    this.items.remove($key);
  }

  updateItem(item: Item) {
    this.items.update(item.$key,
      {
        company: item.company,
        order: item.order,
        beer: item.beer,
        note: item.note,
        abv: item.abv,
        imgUrl: item.imgUrl,
        available: item.available,
        happyHour: item.happyHour,
        lastModified: this.timestamp()
      });
  }

  setOutItem(item: Item) {
    this.items.update(item.$key,
      {
        company: item.company,
        order: item.order,
        beer: item.beer,
        note: item.note,
        abv: item.abv,
        imgUrl: item.imgUrl,
        available: !item.available,
        happyHour: item.happyHour
      });
  }

  shiftTaskDown(item: Item) {
    this.items.update(item.$key,
      {
        company: item.company,
        order: item.order - 1,
        beer: item.beer,
        note: item.note,
        abv: item.abv,
        imgUrl: item.imgUrl,
        available: item.available,
        happyHour: item.happyHour
      });
  }
  shiftTaskUp(item: Item) {
    this.items.update(item.$key,
      {
        company: item.company,
        order: item.order + 1,
        beer: item.beer,
        note: item.note,
        abv: item.abv,
        imgUrl: item.imgUrl,
        available: item.available,
        happyHour: item.happyHour
      });
  }
  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}
