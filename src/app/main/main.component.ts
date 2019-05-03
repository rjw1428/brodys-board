import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Item } from '../shared/item.module';
import { Response } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { ItemsService } from '../shared/items.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { timeout } from 'q';
import { Router } from '@angular/router';
import { trigger, transition, animate, style, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    // trigger('list', [
    //   transition('* => *', [
    //     query(':enter', style({ opacity: 0, transform: 'translateX(-100%)' }), { optional: true }),
    //     query(':enter', stagger('100ms', [
    //       animate('400ms', style({ opacity: 1, transform: 'translateX(0)' }))
    //     ]), { optional: true }),
    //     query(':leave', style({ opacity: 1, transform: 'translateX(0)' }), { optional: true }),
    //     query(':leave', stagger('100ms', [
    //       animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
    //     ]), { optional: true })
    //   ]),
    // ])
  ]
})
export class MainComponent implements OnInit {
  itemList: Item[] = [];
  propertyList: any[] = []
  logoUrl: string;
  screenNum: number = 1;
  sumHeight: Number;
  editMode: boolean = false;
  @ViewChild('test') el: ElementRef

  constructor(private service: ItemsService,
    private storage: AngularFireStorage,
    private router: Router) {
  }

  ngOnInit() {
    this.service.setLastRefreshData("edit")
    this.service.getData().snapshotChanges().subscribe(items => {
      this.itemList = []
      items.forEach(element => {
        var y = element.payload.toJSON();
        y['$key'] = element.key;
        this.itemList.push(y as Item);
      })
    });
  }

  onClick(item: Item) {
    this.service.onClick(item);
  }

  onIconOff(obj: { company: string, filename: string }) {
    this.service.setMissingIcon(obj.company, obj.filename)
  }

  onCancel() {
    this.editMode = false
  }

  onDelete(item: { id: string, index: number }) {
    this.service.deleteItem(item.id)
    this.itemList.forEach(element => {
      if (element.order > item.index)
        this.service.shiftTaskDown(element)
    })
  }

  onInsert(item: { index: number }) {
    this.service.selectedItem = {
      $key: null,
      order: item.index,
      company: '',
      beer: '',
      note: '',
      abv: '',
      imgUrl: '',
      available: true,
      happyHour: true
    }
    this.editMode = true;
  }

  onInsertComplete(item) {
    this.itemList.forEach(element => {
      if (element.order >= item.item.order) {
        this.service.shiftTaskUp(element)
      }
    })
    this.service.insertItem(item.item)
    this.editMode = false
  }

  onEdit(item: { index: number }) {
    this.service.selectedItem = Object.assign({}, this.itemList[item.index]);
    this.editMode = true;
  }

  refresh() {
    window.location.reload(true)
  }
}
