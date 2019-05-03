import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { MenuItem } from './menu-item';
import { map } from 'rxjs/operators'
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuCollection: AngularFireList<any>
  categoryCollection: AngularFireList<any>
  itemSelected: MenuItem
  constructor(private firebaseData: AngularFireDatabase) {
    this.menuCollection = this.firebaseData.list('menuList')
    this.categoryCollection = this.firebaseData.list('categoryList')
  }

  getMenuItems() {
    return this.menuCollection.snapshotChanges().pipe(
      map(vals => vals.map(val => {
        let x = val.payload.toJSON();
        x['id'] = val.key;
        return x as MenuItem;
      }))
    )
  }

  getCategories() {
    return this.categoryCollection.snapshotChanges().pipe(
      map(vals => vals.map(val => {
        let x = val.payload.toJSON();
        x['id'] = val.key;
        return x as Category;
      }))
    )
  }

  insertCategory(category: Category) {
    let ref = this.categoryCollection.push(category)
    return ref.key
  }

  insertItem(menuItem: MenuItem) {
    this.menuCollection.push(menuItem)
  }

  updateItem(menuItem: MenuItem) {
    let key = menuItem.id
    delete menuItem.id
    this.menuCollection.update(key, menuItem)
  }

  updateCategory(key: string, update: any) {
    this.categoryCollection.update(key, update)
  }

  removeItem(input?: string) {
    if (input)
      this.menuCollection.remove(input)
    else {
      this.menuCollection.remove(this.itemSelected.id)
    }
    this.itemSelected = null;
  }

  removeItemFromCategory(catKey: string) {
    console.log(catKey)
    this.menuCollection.snapshotChanges().subscribe(vals => {
      vals.forEach(val => {
        let x = val.payload.toJSON() as MenuItem
        if (x.category == catKey)
          this.removeItem(val.key)
      })
    })
  }
}
