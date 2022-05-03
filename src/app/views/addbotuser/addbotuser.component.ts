import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../shared/service/user.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { UsernameValidator } from "./username.validator";
import { map, switchMap } from "rxjs/operators";
import { combineLatest } from "rxjs";
import * as _ from "lodash";
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
  public h4 = "Add Bot-User";
  public filterUserList: any = [];
  public commentedPosts = [];
  public postToDelete = [];
  public postArr = [];
  public loadingMessage:string = '';
  constructor(
    private userservice: UserService,
    private toastr: ToastrService,
    public fireStrore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.Botuserform = new FormGroup({
      user_name: new FormControl(null, [
        Validators.required,
        UsernameValidator.noWhiteSpace,
      ]),
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
            isBotUser:true,
            date: moment(moment().format("MMMM DD, YYYY, h:mm:ss a")).toDate(),
            phone: "",
            platform: "",
            status_time:  moment(moment().format("MMMM DD, YYYY, h:mm:ss a")).toDate(),
            token: "token",
            token_created_at:  moment(moment().format("MMMM DD, YYYY, h:mm:ss a")).toDate(),
            token_updated_at:  moment(moment().format("MMMM DD, YYYY, h:mm:ss a")).toDate(),
          };
          this.userservice.addUser(data1).then((res: any) => {
            console.log('res :>> ', res);
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
    this.userservice.getUser("date","desc").subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      this.users.sort((a, b) => b.date.toDate() - a.date.toDate());
    });
  }

  public handleDelete(id: string) {
    this.currentUserId = id;
    //Delete user post on deleted user start
    this.userservice.getAllUserPosts().subscribe((res) => {
      this.botPostsList = res.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      this.deleteData = this.botPostsList.filter(
        (data) => data.uid === this.currentUserId
      );
    });
    //Delete user post on deleted user end  
  }

  public deleteUser(): void {
    this.loadingMessage ='Deleting user, Please wait';
    this.deleteData.forEach((ele) => {
      let id = ele.id;
      this.userservice.removePost(id);
    });

    this.getUserData();
    this.deleteBotLikesComments(this.currentUserId);
    this.userservice.remove(this.currentUserId);
    this.toastr.success("User deleted!");
    this.currentUserId = "";
  }

  public deleteBotLikesComments(userId: string) {
    let allPosts: any;
    this.userservice
      .getAllUserPosts()
      .pipe(
        switchMap((res) => {
          allPosts = res.map((r: any) => {
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
        allPosts = res;
        this.deleteLikesOfBot(allPosts, userId);
        this.getFilteredPosts(allPosts, userId);
        this.loadingMessage ='';
        document.getElementById('closeDeleteModal')?.click();
      });
  }

  getFilteredPosts(allPosts, userId) {
    let newArray = [];
    this.postArr = [];
    allPosts.map((post: any) => {
      return Object.assign(post, { filteredComments: post.comments.filter(e => e.commented_user_id === userId) })
    })
    newArray = allPosts.filter(post => post.filteredComments.length > 0);
    if (newArray && newArray.length > 0) {
      newArray.forEach(async (newPost) => {
        await this.deleteBotUserComment(newPost);
      })
    }
  }

  deleteBotUserComment(post) {
    // let postArr =[]
    let count = 0
    if (post.filteredComments && post.filteredComments.length > 0) {

      this.userservice.deleteBotComments(post);
      post.filteredComments.forEach((e, index) => {
          count++;
          const updatedPost = {
            align: post.align,
            category: post.category,
            commentCount: post.commentCount - count,
            id: post.id,
            name: post.name,
            style_color: post.style_color,
            style_font: post.style_font,
            style_size: post.style_size,
            text: post.text,
            time: post.time,
            type: post.type,
            uid: post.uid
          }
          if (index === post.filteredComments.length - 1) {
            this.postArr.push(updatedPost);
          }
      });


      setTimeout(() => {
      this.updateStatusCol(this.postArr);
      }, 0);
    }
  }


  updateStatusCol(arr) {
    if (arr && arr.length > 0) {
      arr.forEach(element => {
        this.userservice.updateStatus(element, element.id);
      });
    }
  }

  public deleteLikesOfBot(allPosts: any, userId: any) {
    let likedPost = [];
    likedPost = allPosts.filter((post: any) =>
      post.liked_user_ids?.find((likedIds) => likedIds === userId)
    );

    likedPost.forEach((post: any) => {
      post.likeCount -= 1;
      let deleteIndex = post.liked_user_ids.indexOf(userId);
      post.liked_user_ids.splice(deleteIndex, 1);
      this.userservice.updateStatus(post, post.id);
    });
  }

  onEdit(item, id) {
    this.currentUserId = id;
    this.Botuserform.patchValue(item);  
    this.h4 = "Update Bot User";
    this.buttonName = "update";
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
