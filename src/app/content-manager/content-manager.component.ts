import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/content.service';
import { Observable } from 'rxjs';
import { UploadComponent } from './upload/upload.component';
import { Upload } from '../shared/upload';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UploadFormComponent } from './upload-form/upload-form.component';

import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.css']
})
export class ContentManagerComponent implements OnInit {
  currentUpload: Upload
  selectedFiles: FileList;

  selected: Upload
  fileList: Observable<Upload[]>
  carouselList: Observable<string[]>
  constructor(
    public contentService: ContentService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    // private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.fileList = this.contentService.getFileList()
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  // uploadSingle() {
  //   let file = this.selectedFiles.item(0)
  //   this.currentUpload = new Upload(file)
  //   console.log(this.currentUpload.dateAdded)
  //   this.contentService.pushUpload(this.currentUpload)
  // }
  addToCarousel() {
    this.contentService.addToCarousel(this.selected.id)
    this.selected=null
  }

  removeFromCarousel() {
    this.contentService.removeFromCarousel(this.selected.id)
    this.selected=null
  }

  clearSelect() {
    this.selected ? this.selected = null : null
  }

  onClick(item: Upload) {
    this.isSelected(item) ? this.selected = null : this.selected = item
  }

  isSelected(item: Upload) {
    if (this.selected != null)
      return this.selected == item
    return false
  }

  remove() {
    if (confirm("Are you sure you want to delete this Image?") == true) {
      this.contentService.deleteFileData(this.selected.id)
      this.contentService.deleteFileStorage(this.selected.sourceUrl)
      //this.contentService.test(this.selected.sourceUrl)
      this.selected = null
    }
  }

  add() {
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
}
