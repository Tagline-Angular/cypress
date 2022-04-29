import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../shared/service/user.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { UsernameValidator } from "./username.validator";
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from "rxjs";
import * as _ from 'lodash';
import { AngularFirestore } from "@angular/fire/firestore";
@Component({
  selector: "app-addbotuser",
  templateUrl: "./addbotuser.component.html",
  styleUrls: ["./addbotuser.component.css"],
})
export class AddbotuserComponent implements OnInit {
  public Botuserform!: FormGroup;
  public users: any = [];
  public submit = "Submit";
  public currentUserId: string = "";
  public itsUpdate: boolean = true;
  public buttonName = "Add";
  public botPostsList = [];
  public deleteData: any = [];
  public h4 = "Add Bot User";
  public filterUserList: any = [];
  public commentedPosts = [];
  public postToDelete = [];
  constructor(
    private userservice: UserService,
    private toastr: ToastrService,
    public fireStrore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.Botuserform = new FormGroup({
      user_name: new FormControl(null, [Validators.required, UsernameValidator.noWhiteSpace]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]),
    });
    this.getUserData();
    this.itsUpdate = false;
  }

  onSubmit() {
    if (this.Botuserform.valid) {
      const duplicateRecord = this.users.filter(
        (item) =>
          item.user_name === this.Botuserform.value.user_name.toLowerCase() ||
          item.email === this.Botuserform.value.email
      );
      if (this.currentUserId) {
        if (duplicateRecord.length > 1) {
          this.toastr.error(
            "Duplicate record found! Please try with different Email/Name."
          );
        } else {
          this.updateUser(this.Botuserform.value);
        }
      } else {
        if (duplicateRecord.length > 0) {
          this.toastr.error(
            "Duplicate record found! Please try with different Email/Name."
          );
        } else {
          const data1 = {
            user_name: this.Botuserform.value.user_name,
            email: this.Botuserform.value.email,
            date: moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
            phone: '',
            platform: '',
            status_time: moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
            token: 'token',
            token_created_at: moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
            token_updated_at: moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
          };
          this.userservice.addUser(data1).then((res: any) => {
            if (res) {
              this.toastr.success("User added!");
              this.Botuserform.reset();
              this.getUserData();
            }
          });
        }
      }
    }
  }

  public getUserData(): void {
    this.userservice.getUser("date", "desc").subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }


  public handleDelete(id: string) {
    this.currentUserId = id;
    // this.deleteBotLikesComments(this.currentUserId);
  }

  public deleteUser(): void {
    this.userservice.remove(this.currentUserId);
    this.toastr.success("User deleted!");
    this.getUserData();
    this.deleteBotLikesComments(this.currentUserId);
    this.currentUserId = "";

  }

  public deleteBotLikesComments(userId: string) {
    let allPosts: any;
    this.userservice.getAllUserPosts()
      .pipe(
        switchMap((res) => {
          allPosts = res
            .map((r: any) => {
              let payload = Object.assign({ id: r.payload.doc.id }, r.payload.doc.data());

              return this.userservice.getCommentsForPost(payload.id)
                .pipe(
                  map((comments: any) => {

                    const data = {
                      ...payload,
                      comments: comments.map(e => Object.assign({ commentId: e.payload.doc.id }, { statusId: r.payload.doc.id }, e.payload.doc.data()))
                    }
                    return data

                  })
                )
            });
          return combineLatest(allPosts);
        })
      )

      .subscribe((res) => {

        this.deleteBotUserComments();

        allPosts = res;
        this.deleteLikesOfBot(allPosts, userId);

        const newArray = [];
        allPosts.forEach((post: any) => {

          const _post = post.comments.filter((e: any) =>
            e.commented_user_id == userId
          )
          if (_post.length) {
            newArray.push(Object.assign(post, { filteredComments: _post }))
          }
        })


        newArray.forEach(async (newPost) => {
          delete newPost.comments;
          newPost.commentCount = newPost.commentCount - newPost.filteredComments.length;
          await this.userservice.deleteBotComments(newPost);

          setTimeout(async () => {
            await delete newPost.filteredComments;
            await delete newPost.comments;
            await this.userservice.updateStatus(newPost, newPost.id);
          }, 0);
        })

        // const batchArray = [];
        // batchArray.push(this.fireStrore.firestore.batch());
        // let operationCounter = 0;
        // let batchIndex = 0;

        // allPosts.forEach(documentSnapshot => {
        //   // console.log('documentSnapshot :>> ', documentSnapshot);
        //   const documentData = documentSnapshot;

        //   // update document data here...
        //   console.log('batchIndex :>> ', batchIndex);
        //   // batchArray[batchIndex].update(documentSnapshot.ref, documentData);
        //   operationCounter++;

        //   if (operationCounter === 499) {
        //     batchArray.push(this.fireStrore.firestore.batch());
        //     batchIndex++;
        //     operationCounter = 0;
        //   }
        // });

        // batchArray.forEach(async batch => await batch.commit());

        // console.log('batchArray :>> ', batchArray);


      });

  }

  public deleteLikesOfBot(allPosts: any, userId: any) {
    let likedPost = [];
    likedPost = allPosts.filter((post: any) =>
      post.liked_user_ids?.find(likedIds =>
        likedIds === userId
      )
    );

    likedPost.forEach((post: any) => {
      post.likeCount -= 1;
      let deleteIndex = post.liked_user_ids.indexOf(userId);
      post.liked_user_ids.splice(deleteIndex, 1);
      this.userservice.updateStatus(post, post.id);
    })
  }


  public deleteBotUserComments() {

  }

  public async deleteCommentsOfBot(allPosts: any, userId: any) {
    // let postToDelete = [];
    // let commentedPosts = []
    this.commentedPosts = [];
    this.postToDelete = [];
    allPosts.forEach((post: any) => {
      this.userservice.getCommentsForPost(post.id).subscribe(async (res: any) => {
        this.commentedPosts.push(res.map((e) => {
          return Object.assign({ statusId: post.id }, { commentId: e.payload.doc.id }, e.payload.doc.data());
        })) // get all posts having comments from any user

        // commentedPosts.forEach((post) => {
        //   if (post.commented_user_id == userId) {
        //     postToDelete.push(post)
        //   }
        // }

        // console.log('commentedPosts :>> ', this.commentedPosts);
        this.postToDelete.push(
          this.commentedPosts.filter((commentPost) =>
            commentPost.commented_user_id == userId
          )
        )

        // console.log('this.postToDelete :>> ', this.postToDelete);

        // if (this.postToDelete && this.postToDelete.length) {
        //   this.postToDelete.forEach((deletepost) => {
        //     this.userservice.deleteBotComments(deletepost, post); // to delete comments
        //     // post.commentCount -= 1;
        //     // this.userservice.decreaseBotCommentCount(post); // to decrease count
        //   })
        // }
      })

    })
    console.log('this.commentedPosts :>> ', this.commentedPosts);

    this.postToDelete = await this.commentedPosts.filter((commentPost) =>
      commentPost.commented_user_id == userId
    )
    console.log('this.commentedPosts :>> ', this.commentedPosts);

    console.log('this.postToDelete :>> ', this.postToDelete);
  }
  onEdit(item, id) {
    this.currentUserId = id;
    this.Botuserform.patchValue(item);
    this.h4 = "Update Bot User";
    this.buttonName = "update"
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  public updateUser(item): void {
    this.userservice
      .updateuser(item, this.currentUserId)
      .then((res) => {
        this.toastr.success("User updated!");
      })
      .catch((err) => {
        this.toastr.error("Something went wrong");
      });
    this.Botuserform.reset();
    this.currentUserId = "";
    this.h4 = "Add Bot User";
  }

  get formControl() {
    return this.Botuserform.controls;
  } 
}
