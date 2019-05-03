import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ItemsService } from '../shared/items.service';
import { Item } from '../shared/item.module';
import { IconNamePipe } from '../shared/icon-name.pipe';
import { AbvPipe } from '../shared/abv.pipe';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  @Output() itemSubmitted = new EventEmitter<{ item: Item }>()
  @Output() itemCancelled = new EventEmitter<{}>()
  imageName = new IconNamePipe();
  abvPipe = new AbvPipe();
  focusCompany: boolean = true;
  focusBeer: boolean = false;
  focusDescription: boolean = false;
  focusAbv: boolean = false;
  constructor(public service: ItemsService,
    private router: Router,
    private route: ActivatedRoute) { }


  ngOnInit() {

  }

  onClick(word: string) {
    console.log(word)
    this.setStyle(word)
  }

  setStyle(word: string) {
    if (word == 'company') {
      this.focusCompany = true
      this.focusBeer = false
      this.focusDescription = false
      this.focusAbv = false
    }
    else if (word == 'beer') {
      this.focusCompany = false
      this.focusBeer = true
      this.focusDescription = false
      this.focusAbv = false
    }
    else if (word == 'desc') {
      this.focusCompany = false
      this.focusBeer = false
      this.focusDescription = true
      this.focusAbv = false
    }
    else if (word == 'abv') {
      this.focusCompany = false
      this.focusBeer = false
      this.focusDescription = false
      this.focusAbv = true
    }
  }


  onSubmit(form: NgForm) {
    form.value.imgUrl = this.imageName.transform(form.value.company)
    form.value.available = true;
    if (form.value.abv == null)
      form.value.abv = '';
    if (form.value.$key == null) {
      //NEW VALUE
      var newItem: Item = {
        $key: null,
        order: form.value.order,
        company: form.value.company,
        beer: form.value.beer,
        note: form.value.note,
        abv: form.value.abv,
        imgUrl: form.value.imgUrl,
        available: true,
        happyHour: form.value.happyHour
      }
      this.itemSubmitted.emit({
        item: newItem
      })
    } else {
      //EDIT VALUE
      this.service.updateItem(form.value);
      this.itemCancelled.emit()
    }
    this.resetForm(form);
    //this.router.navigate(['/'])
  }

  resetForm(form?: NgForm) {
    this.service.selectedItem = {
      $key: null,
      order: null,
      company: '',
      beer: '',
      note: '',
      abv: '',
      imgUrl: '',
      available: true,
      happyHour: true
    }
    if (form != null)
      form.reset();
  }
  onBack() {
    this.itemCancelled.emit()
  }
}
