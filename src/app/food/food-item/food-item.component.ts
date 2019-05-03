import { Component, OnInit, Input, Output } from '@angular/core';
import { MenuItem } from '../../../app/shared/menu-item';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent implements OnInit {
  @Input() item: MenuItem
  @Input() selected: boolean = false;
  bg={
    'background': ''
  }
  constructor() { 
  }

  ngOnInit() {
    this.bg['background']=this.item.img.fbUrl
  }
}
