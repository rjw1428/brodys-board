import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from '../../shared/category';

@Component({
  selector: 'app-catagory-form',
  templateUrl: './catagory-form.component.html',
  styleUrls: ['./catagory-form.component.css']
})
export class CatagoryFormComponent implements OnInit {
  categoryForm: FormGroup
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CatagoryFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public input: Category,
  ) { }

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      id: '',
      name: ['', [Validators.required]],
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onAdd() {
    return this.categoryForm.value
  }

  resetValue(key: string) {
    let x = Object.assign({}, this.categoryForm.value)
    x[key] = ''
    this.categoryForm.setValue(x)
  }
}
