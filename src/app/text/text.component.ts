import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../shared/items.service';
import { Item } from '../shared/item.module';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
  itemList: Item[] = []
  constructor(public service: ItemsService) { }

  ngOnInit() {
    this.service.getData().snapshotChanges().forEach(items => {
      this.itemList = []
      items.forEach(element => {
        var y = element.payload.toJSON();
        y['$key'] = element.key;
        this.itemList.push(y as Item);
      })
      this.itemList.sort((a: Item, b: Item) => {
        let aSplit = a.lastModified.split("/")
        let aDate = new Date(+aSplit[2].substr(0, 4), +aSplit[0] - 1, +aSplit[1])

        let bSplit = b.lastModified.split("/")
        let bDate = new Date(+bSplit[2].substr(0, 4), +bSplit[0] - 1, +bSplit[1])
        return bDate.getTime()-aDate.getTime()
      })
    })
  }
}
