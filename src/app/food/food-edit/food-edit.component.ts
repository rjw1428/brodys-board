import { Component, OnInit, Input } from '@angular/core';
import { FoodFormComponent } from '../food-form/food-form.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { MenuItem } from '../../shared/menu-item';
import { MenuService } from '../../shared/menu.service';
import { Category } from '../../shared/category';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.css']
})
export class FoodEditComponent implements OnInit {
  //foodList: MenuItem[] = []
  categoryList: Category[] = []
  selectedItem: MenuItem
  constructor(
    public service: MenuService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    //this.service.getMenuItems().subscribe(vals => this.foodList = vals)
    this.service.getCategories().subscribe(vals => {
      this.categoryList = vals
      this.categoryList.sort((a, b) => a.order - b.order)
    })
  }

  add() {
    this.service.itemSelected = null
    this.edit()
  }

  edit() {
    let input: MenuItem = Object.assign({})
    if (this.service.itemSelected) {
      input = Object.assign({}, this.service.itemSelected)
    }
    const dialogRef = this.dialog.open(FoodFormComponent, {
      width: '500px',
      disableClose: true,
      data: input
    });

    dialogRef.afterClosed().subscribe((result: MenuItem) => {
      if (result) {
        if (result.id) {
          this.service.updateItem(result)
        } else {
          this.service.insertItem(result)
        }
      }
      this.service.itemSelected = null
    })
  }

  editCategory() {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: { category: Category }) => {
      if (result) {
        let key = result.category.id
        delete result.category
        this.service.updateCategory(key, result)
      }
    })
  }

  remove() {
    if (confirm("Are you sure you want to delete this menu item"))
      this.service.removeItem()
    this.service.itemSelected = null
  }

  drop(event: CdkDragDrop<MenuItem[]>) {
    if (event.previousIndex != event.currentIndex) {
      moveItemInArray(this.categoryList, event.previousIndex, event.currentIndex);
      // this.service.updateFoodList(this.foodList)
    }
  }
}
