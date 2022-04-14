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

  // public getUser() {
  //   return new Promise((resolve, reject) => {
  //     // this.firestore.collection('botuser').valueChanges().subscribe((res:any)=>{
  //     //   console.log('res :>> ', res);
  //     //   res.map(e =>{
  //     //     console.log('e.payload.doc.id :>> ', e.payload.doc.id);
  //     //   })
  //     //  resolve(res)
  //     // })
  //     let botUserCollection = this.firestore.collection('botuser');

  //     botUserCollection
  //       .snapshotChanges()
  //       .pipe(
  //         map((actions) => {
  //           console.log('actions :>> ', actions);
  //           actions.map((a) => {
  //             console.log("a :>> ", a);
  //             resolve({ id: a.payload.doc.id });
  //           });
  //         })
  //       );
  //   });

  // let botUsersCollection: AngularFirestoreCollection<any>;
  // return botUsersCollection.snapshotChanges().map(actions => {
  //   return actions.map(a => {
  //     const data = a.payload.doc.data() as any;
  //     data.id = a.payload.doc.id;
  //     return data;
  //   });
  // });
  // }

  // public getupdate() {}

  // public remove(id: any): Promise<void> {
  //   console.log("id :>> ", id);
  //   return this.firestore.doc(`user/${id}`).delete();
  // }

  public getUser() {
    // return new Promise((resolve) => {
    //   this.firestore.collection('botuser').valueChanges().subscribe((res: any) => {
    //     // console.log('res :>> ', res);
    //     resolve(res)
    //   })
    // })
    return this.firestore.collection('botuser').snapshotChanges();
  }

  // public remove(id: any): Promise<void> {
  //     console.log("id :>> ", id);
  //     return this.firestore.doc(`botuser/${id}`).delete();
  //     return this.firestore.doc('botuser').delete();
  //    }

  // public remove(id:any){
  //   const basepath = this.firestore.doc( `botuser/${id}`)
  //   basepath.delete();  
  // }


  //  remove(id:any){
  //   console.log('id :>> ', id);
  //    this.firestore.collection('botuser').doc(`${id}`).delete();
  // }

  public remove(id: any) {
    const basePath = this.firestore.collection('botuser').doc(id);
    basePath.ref.delete()
    console.log('this.basepath :>> ', this.basepath);
  }
  // public remove(id: string): any {
  //   return new Promise((resolve, reject) => {
  //     const basepath = this.firestore.doc('/botuser/' + id);
  //     console.log('basepath :>> ', basepath);
  //     basepath.delete()
  //     resolve(true);
  //   });
  // }

  // public userUpdate(id: string, data:any): any {
  //   return new Promise((resolve, reject)=>{
  //     const basepath = this.firestore.doc('/botuser/' + id)
  //     basepath.update(data)
  //     resolve(true);
  //   });
  // }
}
