import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { trigger, transition, animate, style, keyframes, state } from '@angular/animations';
import { ItemsService } from '../shared/items.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  animations: [
    trigger('popup', [
      state('up', style({ opacity: 1, transform: 'translateY(0%)' })),
      state('down', style({ opacity: 1, transform: 'translateY(100%) rotate(90deg)' })),
      transition('*<=>*', animate('1s 500ms cubic-bezier(.59, .1, 0.2, 1.5)'))
    ])
  ]
})
export class PopupComponent implements OnInit {
  @Input() screenNum: number;
  @Output() displayComplete = new EventEmitter<{}>()
  popupUrl: string;
  visible: string = 'down';
  xLoc = { 'left': '10%' }
  constructor(private storage: AngularFireStorage, public service: ItemsService) { }

  ngOnInit() {
    this.getImage()
    this.service.checkForPopup().forEach(screens => {
      screens.forEach(property => {
        let key = property.key
        let val: { joke: boolean } = property.payload.toJSON() as any
        if (key == this.screenNum.toString()) {
          this.visible = (val.joke == true?"up":"down")
        }
      })
      if (this.visible=="up") {
        this.xLoc = { "left": Math.ceil(Math.random() * 60 + 10) + "%" }
        setTimeout(() => {
          this.service.setPopup(false, this.screenNum)
        }, 1000 * 5)
      }
    })
  }


  getImage() {
    this.storage.ref('joe.png').getDownloadURL().toPromise()
      .then(value => {
        this.popupUrl = value;
      })
      .catch(e => console.log(e))
  }
}
