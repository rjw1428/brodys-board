import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { Item } from '../shared/item.module';
import { ItemsService } from '../shared/items.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ItemComponent } from '../item/item.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  animations: [
    trigger('list1', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translateX(-100%)' }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('500ms 700ms ease-in', style({ opacity: 1, transform: 'translateX(0)' }))
        ]), { optional: true }),
        query(':leave', style({ opacity: 1, transform: 'translateX(0)' }), { optional: true }),
        query(':leave', stagger('100ms', [
          animate('400ms ease-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
        ]), { optional: true })
      ]),
    ]),
    trigger('list2', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: 'translateX(100%)' }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('500ms 700ms ease-in', style({ opacity: 1, transform: 'translateX(0)' }))
        ]), { optional: true }),
        query(':leave', style({ opacity: 1, transform: 'translateX(0)' }), { optional: true }),
        query(':leave', stagger('100ms', [
          animate('400ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
        ]), { optional: true })
      ]),
    ]),
    trigger('background', [
      transition(':enter', [
        style({ opacity: 0 }), animate(750, style({ opacity: .7 }))
      ])
    ])
  ],
  host: { '[@background]': '' }
})
export class DisplayComponent implements OnInit {
  @ViewChild('column1') column1: ElementRef
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
  screenWidth: number;
  screenHeight: number;
  itemList: Item[] = [];
  logoUrl: string;
  screenNum: number;
  col1: Item[] = [];
  col2: Item[] = [];
  sumHeight: number = 0;
  totalCol = 4;
  totalScreen = 2;
  titleFontSize: number;
  noteFontSize: number;
  abvFontSize: number;
  iconSize: number;
  backgroundColor: any;
  constructor(private service: ItemsService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute) {
    this.onResize();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.screenNum = params['screen']
    });
    this.service.resetRefreshOnLoad(this.screenNum.toString())
    this.service.setLastRefreshData(this.screenNum.toString())
    this.getLogo();
    this.service.getData().snapshotChanges().forEach(items => {
      this.itemList = []
      items.forEach(element => {
        var y = element.payload.toJSON();
        y['$key'] = element.key;
        this.itemList.push(y as Item);
      })
      this.setScreenColumnCounts();
    });
    this.service.setScreenResolution(this.screenNum.toString(), this.screenWidth, this.screenHeight)
    this.service.checkForRefresh(this.screenNum.toString())

    this.service.getProperties().snapshotChanges().subscribe(properties => {
      console.log(properties)
      properties.forEach(property => {
        if (property.key == "titleFontSize")
          this.titleFontSize = +property.payload.val()
        else if (property.key == "noteFontSize")
          this.noteFontSize = +property.payload.val()
        else if (property.key == "abvFontSize")
          this.abvFontSize = +property.payload.val()
        else if (property.key == "iconSize")
          this.iconSize = +property.payload.val()
        else if (property.key == "itemBackground")
          this.backgroundColor = property.payload.val()
      })
    })
  }

  onPopupComplete() {
    this.service.setPopup(false, this.screenNum)
  }

  brokerItems(start: number, end: number) {
    var list: Item[] = [];
    for (var i = start; i < end; i++)
      list.push(this.itemList[i])
    return list;
  }

  onClick(item: Item) {
    this.service.onClick(item);
  }

  getLogo() {
    this.storage.ref('logo.png').getDownloadURL().toPromise()
      .then(value => {
        this.logoUrl = value;
      })
      .catch(e => console.log(e))
  }

  setScreenColumnCounts() {
    var start = 0
    var end1 = 0
    var end2 = 0
    if (this.itemList.length % this.totalCol == 1) {
      if (this.screenNum == 1) {
        start = 0;
        end1 = start + Math.ceil(this.itemList.length / this.totalCol)
        end2 = end1 + Math.floor(this.itemList.length / this.totalCol)
      } else if (this.screenNum == 2) {
        start = Math.ceil(this.itemList.length / this.totalCol) + Math.floor(this.itemList.length / this.totalCol);
        end1 = start + Math.floor(this.itemList.length / this.totalCol)
        end2 = end1 + Math.floor(this.itemList.length / this.totalCol)
      }
    } else if (this.itemList.length % this.totalCol == 2) {
      if (this.screenNum == 1) {
        start = 0;
        end1 = start + Math.ceil(this.itemList.length / this.totalCol)
        end2 = end1 + Math.floor(this.itemList.length / this.totalCol)
      } else if (this.screenNum == 2) {
        start = Math.ceil(this.itemList.length / this.totalCol) + Math.floor(this.itemList.length / this.totalCol);
        end1 = start + Math.ceil(this.itemList.length / this.totalCol)
        end2 = this.itemList.length
      }
    } else {
      if (this.screenNum == 1) {
        start = 0;
        end1 = start + Math.ceil(this.itemList.length / this.totalCol)
        end2 = end1 + Math.ceil(this.itemList.length / this.totalCol)
      } else if (this.screenNum == 2) {
        start = Math.ceil(this.itemList.length / this.totalCol) + Math.ceil(this.itemList.length / this.totalCol);

        end1 = start + Math.ceil(this.itemList.length / this.totalCol)
        end2 = this.itemList.length
      }
    }
    this.col1 = this.brokerItems(start, end1);
    this.col2 = this.brokerItems(end1, end2)
  }

  onItemRemoved(item: { id: string, index: number }) {
    console.log(item)
    for (var i = 0; i < this.col1.length; i++)
      if (item.id == this.col1[i].$key) {
        this.col1.splice(item.index, 1)
        break;
      }
    for (var i = 0; i < this.col2.length; i++)
      if (item.id == this.col2[i].$key) {
        this.col2.splice(item.index, 1)
        break;
      }
    this.service.deleteItem(item.id)
  }
}
