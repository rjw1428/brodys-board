import { Component, OnInit, HostListener } from '@angular/core';
import { ItemsService } from '../shared/items.service';
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  toggleMenu: boolean;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  screenWidth: number;
  constructor(private service: ItemsService, private fb: FacebookService) {
    let initParams: InitParams = {
      appId: '123456',
      xfbml: true,
      version: 'v2.4'
    };
    this.onResize();
  }

  ngOnInit() {
  }
  onForceRefresh() {
    this.service.forceRefresh()
    alert("Refresh Command Sent")
  }

  togglePopup() {
    let x = Math.random() * 100
    let screenNum = (x >= 50 ? "1" : "2")
    this.service.setPopup(true, screenNum)
  }

  onClick() {
    this.toggleMenu == true ? this.toggleMenu = false : this.toggleMenu = true
  }
}
