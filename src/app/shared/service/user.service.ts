import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public basepath = this.firestore.collection("/botuser");
  public basepath1 = this.firestore.collection("/Users");
  public basepath2 = this.firestore.collection("/Status")

  constructor(private firestore: AngularFirestore) {}

  public addUser(userDetails: any): any {
    return new Promise((resolve, reject) => {
      this.basepath.add(userDetails);
      resolve(true);
    });
  }

  public addBotUserPost(botUserDetails: any): any {
    return this.firestore.collection("Status").add(botUserDetails);
  }

  public getUser(key: string, action: any) {
    return this.firestore
      .collection("botuser", (ref) => ref.orderBy(key, action))
      .snapshotChanges();
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
      .collection("Users", (ref) => ref.orderBy("user_name", "asc"))
      .snapshotChanges();
  }

  //like and comments update in firebase
  public getPostByUser(userId: string) {
    return this.firestore
      .collection("Status", (ref) => ref.where("uid", "==", userId))
      .snapshotChanges();
  }

  public updateStatus(userInfo: any, userId: string) {
    this.firestore.collection("Status").doc(userId).update(userInfo);
  }

  public getCommentsForPost(postId: string) {
    return this.firestore
      .collection("Status")
      .doc(postId)
      .collection("comments")
      .snapshotChanges();
  }

  public getAllUserPosts() {
    return this.firestore
      .collection("Status", (ref) => ref.orderBy("time", "desc"))
      .snapshotChanges();
  }

  public addComment(postId: string, commentData: any) {
    return this.firestore
      .collection("Status/" + postId + "/comments")
      .add(commentData);
  }

  public deleteBotComments(posts) {
    const basePath = this.firestore.collection("Status").doc(posts.statusId).collection("comments").doc(posts.commentId);
    basePath.ref.delete();
  }

  public decreaseBotCommentCount(post) {
     console.log('post :>> ', post);
    this.firestore.collection("Status").doc(post.statusId).update(post);  
  }

  public removeBotUserPost(id: any) {
    console.log('id :>> ', id);
    const userPostDelete = this.firestore.collection("Status").doc(id)
    userPostDelete.ref.delete()
  }

}