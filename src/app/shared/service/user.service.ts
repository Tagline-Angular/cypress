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

  public updateuser(user: any) {
    console.log('user :>> ', user);
    // const basepath = this.firestore.collection('/botuser').doc(user.id)
    return this.firestore.collection('/botuser').doc(user.id).update(user);
    // basepath.id.update(user).then(res => console.log('res :>> ', res)).catch(err => console.log("error", err))
  }
}


