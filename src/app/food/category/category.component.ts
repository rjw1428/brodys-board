import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuService } from '../../shared/menu.service';
import { MenuItem } from '../../shared/menu-item';
import { Category } from '../../shared/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @Input() category: Category
  foodList: MenuItem[] = []
  // foodSelected: number = -1;
  constructor(private service: MenuService) { }

  ngOnInit() {
    this.service.menuCollection.snapshotChanges().subscribe(vals => {
      this.foodList = []
      vals.map(val => {
        let x = val.payload.toJSON() as MenuItem
        x['id'] = val.key
        if (x.category == this.category.id)
          this.foodList.push(x)
      })
    })
  }

  onClick(item: MenuItem) {
    if (this.service.itemSelected && item.id == this.service.itemSelected.id)
      this.service.itemSelected = null
    else
      this.service.itemSelected = item

    //this.service.itemSelected = this.foodList[this.foodSelected]
    // console.log(this.foodSelected)
  }

  isSelected(item: MenuItem) {
    if (this.service.itemSelected && item.id == this.service.itemSelected.id)
      return true
    return false
  }
}
