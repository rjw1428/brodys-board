import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Category } from '../../shared/category';
import { MenuService } from '../../shared/menu.service';
import { Observable } from 'rxjs/Observable';
import { MenuItem } from '../../shared/menu-item';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
  categoryEditForm: FormGroup
  categories: Observable<Category[]>
  selected: number

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CategoryEditComponent>,
    @Inject(MAT_DIALOG_DATA)
    public input: Category,
    private service: MenuService
  ) { }

  ngOnInit() {
    this.initializeForm()
    this.categories = this.service.getCategories()
  }

  initializeForm() {
    this.categoryEditForm = this.fb.group({
      category: '',
      name: ['', [Validators.required]],
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onAdd() {
    return this.categoryEditForm.value
  }

  resetValue(key: string) {
    let x = Object.assign({}, this.categoryEditForm.value)
    x[key] = ''
    this.categoryEditForm.setValue(x)
  }

  onDelete() {
    if (confirm("Are you sure you want to delete this category?")) {
      // this.service.menuCollection.snapshotChanges().subscribe(vals => {
      //   vals.map(val => {
      //     let x = val.payload.toJSON() as MenuItem
      //     if (x.category == this.categoryEditForm.get('category').value.id)
      //       itemCount++;
      //   })
      // if (itemCount > 0)
      //   this.snackBar.open("There are currently menu items in this category, please remove items before deleting the category.", "OK", {
      //     duration: 3000,
      //   })
      // })
      let key = this.categoryEditForm.get('category').value.id
      this.service.removeItemFromCategory(key)
      this.service.categoryCollection.remove(key)
      this.snackBar.open(`${this.categoryEditForm.get('category').value.name} has been deleted.`, "OK", {
        duration: 3000,
      })
      this.onNoClick()
    }
  }
}
