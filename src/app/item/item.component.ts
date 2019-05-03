import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, HostListener } from '@angular/core';
import { ItemsService } from '../shared/items.service'
import { Item } from '../shared/item.module';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations'
declare var $: any;

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  // animations: [
  //   trigger('tableState', [
  //     state('normal', style(
  //       { 'transform': 'translateX(0px)' }
  //     )),
  //     state('change', style(
  //       {
  //         'transform': 'translateX(-100px)',
  //       }
  //     )),
  //     transition('normal <=> change', animate(300))
  //   ])
  // ]
})

export class ItemComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  @Input() index: number;
  @Input() margin: number;
  @ViewChild('block') element: ElementRef
  @Output() blockInfo = new EventEmitter<{ top: number, height: number, index: number }>();
  @Output() itemLoaded = new EventEmitter<{ message: string, top: number, height: number }>();
  @Output() itemInserted = new EventEmitter<{ index: number }>()
  @Output() itemRemoved = new EventEmitter<{ id: string, index: number }>()
  @Output() itemChanged = new EventEmitter<{ index: number }>()
  @Output() iconOff = new EventEmitter<{ company: string, filename: string }>()
  @Input() editable = false;
  imgUrl: string;
  state = 'normal';
  active = true;
  // titleFontSize = 19;
  // noteFontSize = 16;
  // abvFontSize = 20;
  // iconSize = 75;
  @Input() titleFontSize: number;
  @Input() noteFontSize: number;
  @Input() abvFontSize: number;
  @Input() iconSize: number;
  @Input() backgroundColor: string = "rgba(50,50,50,.8)";
  constructor(private service: ItemsService,
    private storage: AngularFireStorage,
    private router: Router,
    private el: ElementRef,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.route.routeConfig.path.indexOf("display") >= 0)
      this.editable = false;
    this.getImage(this.item.imgUrl);
  }

  ngAfterViewInit() {
    this.blockInfo.emit({
      top: this.el.nativeElement.offsetTop,
      height: this.el.nativeElement.offsetHeight,
      index: this.index
    })
  }

  getImage(name: string) {
    const ref = this.storage.ref('breweries/' + name);
    let x = ref.getDownloadURL()
      .toPromise()
      .then(value => {
        this.imgUrl = value;
      })
      .catch(e => {
        this.iconOff.emit({company: this.item.company, filename: name})
        console.log(e)
      })
  }

  onChange() {
    this.state == "normal" ? this.state = "change" : this.state = 'normal';
  }

  onOut() {
    this.service.setOutItem(this.item)
  }

  onRemove() {
    if (confirm("Are you sure you want to delete this Menu Item?") == true)
      this.itemRemoved.emit({
        id: this.item.$key,
        index: this.item.order
      })
  }

  onEdit() {
    this.itemChanged.emit({
      index: this.item.order
    })
  }

  onNew() {
    this.itemInserted.emit({
      index: this.item.order + 1
    })
  }

  setGridColStyle() {
    let style = {
      'grid-template-columns': this.iconSize + 'px auto 11%'
    }
    return style
  }

  setBackgroundStyle() {
    let style = {
      'background-color': this.backgroundColor
    }
    // console.log(style)
    return style
  }
}
