import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public basepath = this.firestore.collection("/botuser");
  public basepath1 = this.firestore.collection("/Users");

  constructor(private firestore: AngularFirestore) { }

  public addUser(userDetails: any): any {
    return new Promise((resolve, reject) => {
      this.basepath.add(userDetails);
      resolve(true);
    });
  }

  public getUser(key: string, action: any) {
    return this.firestore.collection("botuser",(ref)=> ref.orderBy(key,action)).snapshotChanges();
  }

  public remove(id: any) {
    const basePath = this.firestore.collection("botuser").doc(id);
    basePath.ref.delete();
  }

  public updateuser(userInfo: any, userId: string) {
    return this.firestore.collection("/botuser").doc(userId).update(userInfo);
  }

  public getAllUser() {
    return this.firestore
      .collection("Users", (ref) => ref.orderBy("user_name","asc"))
      .snapshotChanges();
  }

  public getPostByUser(userId: string) {
    return this.firestore.collection("Status", (ref) => ref.where("uid", "==", userId)).snapshotChanges();
  }

  public updateStatus(userInfo: any, userId: string) {
    return this.firestore.collection("/Status").doc(userId).update(userInfo);
  }

  public getCommentsForPost(postId: string) {
    return this.firestore
      .collection("Status")
      .doc(postId)
      .collection("comments")
      .snapshotChanges();
  }

  public addComment(postId: string, commentData: any) {
    return this.firestore
      .collection("Status/" + postId + "/comments")
      .add(commentData);
  }
}
