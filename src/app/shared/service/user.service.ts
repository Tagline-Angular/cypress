import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { rejects } from "assert";
import { resolve } from "path";
import { promise } from "protractor";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public basepath = this.firestore.collection("/botuser");
  public basepath1 = this.firestore.collection("/Users")

  constructor(private firestore: AngularFirestore) { }

  public addUser(userDetails: any): any {
    return new Promise((resolve, reject) => {
      this.basepath.add(userDetails)
      console.log('userdetails :>> ', userDetails);
      resolve(true);
      
    });
  }

  public getUser() {
    return this.firestore.collection('botuser').snapshotChanges()
  //   .pipe(
  //     map(changes => {
  //         return changes.map(a => {
  //             const data = a.payload.doc.data() as any;
  //             Object.keys(data).filter(key => data[key] instanceof Timestamp)
  //                 .forEach(key => data[key] = data[key].toDate())
  //             data._id = a.payload.doc.id;
  //             return data;
  //         });
  //     })
  // );
  }

  public remove(id: any) {
    const basePath = this.firestore.collection('botuser').doc(id);
    basePath.ref.delete()
    console.log('this.basepath :>> ', this.basepath);
  }

  public updateuser(userInfo: any,userId:string) {
    return this.firestore.collection('/botuser').doc(userId).update(userInfo);
  }

  public getAllUser(){
    return this.firestore.collection('Status').snapshotChanges();
  }

  public updateStatus(userInfo: any,userId:string){
    return this.firestore.collection('/Status').doc(userId).update(userInfo)
  }
}


