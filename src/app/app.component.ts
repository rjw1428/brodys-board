import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemsService } from './shared/items.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  timeDelay = 10; //IN MINUTES
  backgroundColor = 'black'
  constructor(public service: ItemsService) {

  }
  ngOnInit() {
    var time = Observable.interval(60000 * this.timeDelay)
      .subscribe(x => {
        var date = new Date()
        if (date.getHours() == 4 && date.getMinutes() >= 0) {
          console.log("COUNTDOWN TO REFRESH STARTED")
          setTimeout(() => this.refresh(), 60000 * 100);
        } else console.log(date);
      })

    this.service.getProperties().snapshotChanges().subscribe(vals => {
      // vals.forEach(val => {
      //   if (val.key == 'backgroundColor')
      //     this.backgroundColor = val.payload.val()
      // })
    })
  }

  refresh() {
    window.location.reload(true)
  }

  setBackgroundColor() {
    let style = {
      'background-color': this.backgroundColor
    }
    return style
  }
}