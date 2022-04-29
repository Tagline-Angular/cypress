import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../shared/service/user.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { UsernameValidator } from "./username.validator";

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
  public h4 = "Add Bot User";
  public filterUserList: any = [];
  constructor(
    private userservice: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.Botuserform = new FormGroup({
      user_name: new FormControl(null, [Validators.required,UsernameValidator.noWhiteSpace]),
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
            status_time:  moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
            token: 'token',
            token_created_at:  moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
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
    this.deleteBotLikesComments(this.currentUserId);

  }

  public deleteUser(): void {
    this.userservice.remove(this.currentUserId);
    this.toastr.success("User deleted!");
    this.getUserData();
    // this.deleteBotLikesComments(this.currentUserId);
    this.currentUserId = "";

  }

  public deleteBotLikesComments(userId: string) {
    let allPosts: any;
    this.userservice.getAllUserPosts().subscribe((res) => {
      allPosts = res.map((e) => {
        return e.payload.doc.data();
      });

      this.deleteLikesOfBot(allPosts, userId);  // delete bot users likes
      this.deleteCommentsOfBot(allPosts, userId); // delete bot users comments

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

  
  public deleteCommentsOfBot(allPosts: any, userId: any) {
    let postToDelete = [];
    allPosts.forEach((post: any) => {
      this.userservice.getCommentsForPost(post.id).subscribe(async (res: any) => {
        let commentedPosts = res.map((e) => {
          return Object.assign({ statusId: post.id }, { commentId: e.payload.doc.id }, e.payload.doc.data());
        }); // get all posts having comments from any user

          // commentedPosts.forEach((post) => {
          //   if (post.commented_user_id == userId) {
          //     postToDelete.push(post)
          //   }
          // }
          
          postToDelete = commentedPosts.filter((commentPost) =>
            commentPost.commented_user_id == userId
          )

          if (postToDelete && postToDelete.length) {
            postToDelete.forEach((deletepost) => {
              this.userservice.deleteBotComments(deletepost, post); // to delete comments
              // post.commentCount -= 1;
              // this.userservice.decreaseBotCommentCount(post); // to decrease count
            })
          }
      })

    })
    console.log('postToDelete :>> ', postToDelete);
  }

  onEdit(item, id) {
    this.currentUserId = id;
    this.Botuserform.patchValue(item);
    this.h4 = "Update Bot User";
    this.buttonName ="update"
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
