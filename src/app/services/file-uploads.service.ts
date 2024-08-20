import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { Image } from '../interfaces/Image';

@Injectable({
  providedIn: 'root'
})
export class FileUploadsService {

  constructor(private storage: AngularFireStorage) { }

  uploadFiles(endpoint:string, files: FileList): Promise<Image[]> {
    let fileList = Array.from(files);
    const promiseList: Promise<void>[] = []; // Use a Promise<void> array
    const downloadList: Image[] = [];

    for (let file of fileList) {
      // Create a promise for each file upload
      const uploadPromise = new Promise<void>((resolve, reject) => {
        const filePath = `${endpoint}/${file.name}`;
        const storageRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, file);

        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe({
              next: downloadURL => {
                downloadList.push({
                  name: file.name,
                  path: downloadURL
                });
                resolve(); // Resolve the promise when the URL is retrieved
              },
              error: err => {
                reject(err); // Reject the promise if there is an error getting the download URL
              }
            });
          })
        ).subscribe();
      });

      // Add each upload promise to the promise list
      promiseList.push(uploadPromise);
    }

    // Return a promise that resolves when all upload promises have resolved
    return Promise.all(promiseList).then(() => downloadList);
  }

  deleteFileStorage(path:string, name: string): void {
    const storageRef = this.storage.ref(path);
    storageRef.child(name).delete();
  }
}
