import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuItem } from '../../shared/menu-item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../shared/content.service';
import { Upload } from '../../shared/upload';
import { Observable } from 'rxjs';
import { CatagoryFormComponent } from '../catagory-form/catagory-form.component';
import { UploadFormComponent } from '../../content-manager/upload-form/upload-form.component';
import { Category } from '../../shared/category';
import { MenuService } from '../../../app/shared/menu.service';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.css']
})
export class FoodFormComponent implements OnInit {
  menuForm: FormGroup
  categories: Observable<Category[]>
  fileList: Observable<Upload[]>
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FoodFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public input: MenuItem,
    // private afs: AngularFirestore,
    // private storage: AngularFireStorage,
    public contentService: ContentService,
    public menuService: MenuService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm()
    this.fileList = this.contentService.getFileList()
    this.categories = this.menuService.getCategories()
  }

  initializeForm() {
    if (this.input.id) {
      //console.log(this.input)
      this.menuForm = this.fb.group(this.input)
      console.log(this.menuForm.get('img').value)
    } else {
      this.menuForm = this.fb.group({
        id: '',
        category: ['', [Validators.required]],
        name: ['', [Validators.required]],
        description: '',
        img: ''
      })
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onAdd() {
    // console.log(this.menuForm.value)
    return this.menuForm.value
  }

  resetValue(key: string) {
    let x = Object.assign({}, this.menuForm.value)
    x[key] = ''
    this.menuForm.setValue(x)
  }

  setValue(key: string, value: string) {
    let x = Object.assign({}, this.menuForm.value)
    x[key] = value
    this.menuForm.setValue(x)
  }

  openImageUpload() {
    const dialogRef = this.dialog.open(UploadFormComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed()
      .subscribe((result: Upload) => {
        if (result) {
          this.contentService.pushUpload(result)
          this.snackBar.open(`${result.file.name} has been uploaded`, "OK", {
            duration: 3000,
          })
        }
      })
  }

  openCatForm() {
    const dialogRef = this.dialog.open(CatagoryFormComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed()
      .subscribe((result: Category) => {
        if (result) {
          delete result.id
          let key = this.menuService.insertCategory(result)
          this.setValue('category', key)
        }
      })
  }
}
