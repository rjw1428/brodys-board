import { Injectable } from '@angular/core';
import { Upload } from '../shared/upload';
// import { Content } from '@shared/interfaces/content';
import { Observable, defer, combineLatest } from 'rxjs';
import { storage } from 'firebase/app';
import { AngularFirestoreCollection, AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map, switchMap, shareReplay } from 'rxjs/operators'
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  contentList: AngularFirestoreCollection
  contentList$: Observable<Upload[]>
  client: string;
  constructor(private afs: AngularFirestore, private db: AngularFireDatabase) { }

  getFileList(client?: string) {
    this.client = client
    this.contentList = this.afs.collection('content')
    this.contentList$ = this.contentList.snapshotChanges().pipe(
      map(vals => {
        return vals.map(val => {
          let x = val.payload.doc.data()
          x['id'] = val.payload.doc.id
          return x as Upload
        })
      })
    )
    return this.contentList$
    // return this.db.list(this.basePath)
  }

  pushUpload(upload: Upload) {
    console.log(upload);
    upload['sourceUrl'] = this.formatSource(upload.file.name)
    let uploadTask = storage().ref().child(`site-images/${upload.sourceUrl}`).put(upload.file)
    uploadTask.on(storage.TaskEvent.STATE_CHANGED,
      (inProgress) => {
        upload.progress = Math.ceil((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100)
      },
      (error) => {
        console.log(error)
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            let x = Object.assign({ ['fbUrl']: downloadURL, ['dateAdded']: this.timestamp(), ['carousel']: false }, upload)
            delete x.file
            this.contentList.add(x).then(ref => {
              console.log(ref.id)
            })
          })
      })


  }

  // pushUrl(upload: string, name: string) {
  //   let progress: number
  //   let x = storage().ref().child(`content/${this.client}/features/${name}`)
  //   //this.uploadTask = x.put()
  //   this.uploadTask.on(storage.TaskEvent.STATE_CHANGED,
  //     (inProgress) => {
  //       progress = Math.ceil((this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes) * 100)
  //     },
  //     (error) => {
  //       console.log(error)
  //     },
  //     () => {
  //       this.uploadTask.snapshot.ref.getDownloadURL()
  //         .then(downloadURL => {
  //           let x = {
  //             displayName: name,
  //             fbUrl: downloadURL,
  //             dateAdded: this.timestamp(),
  //             sourceUrl: upload,
  //           }
  //           this.contentList.add(x)
  //         })
  //     })
  // }

  // deleteUpload(upload: Upload) {
  //   this.deleteFileData(upload.id)
  //     .then(() => {
  //       this.deleteFileStorage(upload.sourceUrl)
  //     })
  //     .catch(error => console.log(error))
  // }

  deleteFileData(key: string) {
    return this.contentList.doc(key).delete()
  }

  deleteFileStorage(name: string) {
    firebase.storage().ref().child('site-images/' + name)
      .delete()
      .then(ref => {
        console.log(`${name} has been deleted`)
      }).catch(function (error) {
        console.log(error)
        // Uh-oh, an error occurred!
      });
  }

  formatSource(sourceName: string) {
    let words = sourceName.split(' ')
    let output: string = ''
    words.forEach(word => {
      output += word + "_"
    })
    return output.substr(0, output.length - 1)
  }


  addToCarousel(key: string) {
    this.contentList.doc(key).update({
      'carousel': true
    })
  }

  removeFromCarousel(key: string) {
    this.contentList.doc(key).update({
      'carousel': false
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}
