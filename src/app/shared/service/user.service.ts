import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { rejects } from "assert";
import { resolve } from "path";
import { promise } from "protractor";
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
      this.basepath.add(userDetails);
      resolve(true);
    });
  }

  public getUser() {
    return this.firestore.collection('botuser').snapshotChanges();
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
}


