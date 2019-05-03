import { Component, OnInit, Input } from '@angular/core';
import { Upload } from '../../shared/upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() file: Upload
  @Input() selected: boolean
  constructor(
    // public contentService: ContentService
  ) { }

  ngOnInit() {
  }

  onClick() {
    console.log(this.file)
  }
}
