import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { DialogAddBeerDialog } from 'search/beer-form/form.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ContentService } from '@shared/services/content.service';
import { Upload } from '../../shared/upload';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {
  uploadForm: FormGroup
  selectedFiles: File
  img: string | ArrayBuffer
  currentUpload: Upload;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public input: any,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm() {
    this.uploadForm = this.fb.group({
      displayName: ['', [Validators.required]],
      file: '',
      //fileUrl: '',
    })
  }

  getPreview() {
    if (this.img == null)
      return null
    return this.img
  }

  detectFiles(event) {
    if (event.target.files[0]) {
      this.selectedFiles = event.target.files[0]
      var reader = new FileReader();
      reader.onload = e => this.img = reader.result;
      reader.readAsDataURL(this.selectedFiles);
    }
    else this.img = ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd() {
    if (this.selectedFiles) {
      this.currentUpload = new Upload(this.selectedFiles)
      this.currentUpload['displayName'] = this.uploadForm.get('displayName').value
      return this.dialogRef.close(this.currentUpload)
      // console.log(this.currentUpload)
      // this.service.pushUpload(this.currentUpload, this.uploadForm.get('displayName').value)
      // setTimeout(() => {

      // }, 1000)
    } else {
      // this.service.pushUrl(this.uploadForm.get('fileUrl').value, this.uploadForm.get('displayName').value)
      // setTimeout(() => {
      return this.dialogRef.close()
      // }, 1000)
    }
  }
}
