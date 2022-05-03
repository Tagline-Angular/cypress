import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../shared/service/user.service";
import * as moment from "moment";

@Component({
  selector: "app-realuser",
  templateUrl: "./realuser.component.html",
  styleUrls: ["./realuser.component.css"],
})
export class RealuserComponent implements OnInit {
  public selectedtitle: string = "";
  public users: any = [];
  public botLists: any = [];
  public cuurentUserId: string = "";
  public currentPostId: string = "";
  public botUserCommentForm!: FormGroup;
  public userListForm: FormGroup;
  public botUserLikeForm: FormGroup;
  public realUserList!: FormGroup;
  public postsList: any = [];
  public postData: any;
  public isUserPost: boolean = false;
  public botUserunLikeForm!: FormGroup;
  public buttonName = "Like";
  public disableComment: boolean = false;
  public isAlreadyLiked: boolean = false;
  public blockUser: boolean = false;
  public search: boolean = false;
  public botUserSelected: boolean = false;
  public finalarrays: [] = [];
  public realUser;
  public FCMtoken: any = [];
  public userErrorMessage: string = 'Please Select Bot-User';

  constructor(
    private userservice: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createFormForBotList();
    this.createFormForRealUserList();
    this.getAllUserList();
    this.getBotUserList();
  }

  public getPostForUser(): void {
    const id = this.realUserList.value.selectRealUser;
    this.userservice.getPostByUser(id).subscribe((posts) => {
      this.postsList = posts.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      this.postsList.sort((a, b) => b.time.toDate() - a.time.toDate());
      this.isUserPost = true;
    });
    this.selectedtitle = this.users.filter(
      (item) => item.user_id === id
    )[0]?.user_name;
  }

  public createFormForBotList(): void {
    this.botUserCommentForm = new FormGroup({
      selectBot: new FormControl("", Validators.required),
      comment: new FormControl("", [
        Validators.required,
        Validators.pattern(""),
      ]),
    });
    this.botUserLikeForm = new FormGroup({
      selectBot: new FormControl("", Validators.required),
    });
    this.botUserunLikeForm = new FormGroup({});
  }

  public createFormForRealUserList(): void {
    this.realUserList = new FormGroup({
      selectRealUser: new FormControl(),
    });
  }

  private getAllUserList(): void {
    this.userservice.getAllUser().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      this.realUser = this.users;
    });
    document.getElementById("yourId").focus();
  }

  private getBotUserList(): void {
    this.userservice.getUser("user_name", "asc").subscribe((data) => {
      this.botLists = data.map((e) => {
        return Object.assign(
          { user_id: e.payload.doc.id },
          e.payload.doc.data()
        );
      });
      this.users = this.users.concat(this.botLists);
      this.users = this.users.concat(this.botLists).sort(function (a, b) {
        return a.name < b.user_name ? -1 : a.name === b.name ? 0 : 1;
      });
    });
  }

  // select method for bot selector
  selectBotUser(event) {
    this.botUserSelected = true;
    if (
      this.postData.liked_user_ids &&
      this.postData.liked_user_ids.includes(event.target.value)
    ) {
      this.buttonName = "UnLike";
      this.isAlreadyLiked = true;
    } else {
      this.isAlreadyLiked = false;
      this.buttonName = "Like";
    }
    if (
      this.postData.blocked_users &&
      this.postData.blocked_users.includes(event.target.value)
    ) {
      this.blockUser = true;
    } else {
      this.blockUser = false;
    }
  }

  public submitLikeUnlike() {
    if (this.botUserSelected) {
      if (this.isAlreadyLiked) {
        const likes: number = this.postData.likeCount;
        const totalLikes = likes ? likes - 1 : 1;
        this.postData.likeCount = totalLikes;
        // remove liked user id from array
        const index = this.postData.liked_user_ids.indexOf(
          this.botUserLikeForm.value.selectBot
        );
        if (index > -1) {
          this.postData.liked_user_ids.splice(index, 1);
        }
      } else {
        let likes: number = this.postData.likeCount;
        const totalLikes = likes ? likes + 1 : 1;
        this.postData.likeCount = totalLikes;
        this.postData.liked_user_ids = this.postData.liked_user_ids
          ? this.postData.liked_user_ids
          : []; // create new field if there's no likes
        this.postData.liked_user_ids.push(this.botUserLikeForm.value.selectBot);
        //send like notiofication
        const test = this.realUser.filter(
          (selectedUser) => selectedUser.id === this.postData.uid
        );
        if (test && test.length > 0) {
          this.FCMtoken.push(test[0].token);
        } else this.FCMtoken = [];

        const userData = this.getBotUser(this.botUserLikeForm.value.selectBot)[0];
        let reqObj = {
          content_available: true,
          mutable_content: true,
          notification: {
            title: userData.user_name,
            body: "Liked your post",
          },
          data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            id: userData.user_id,
            status: 'done',
            type: 'status',
            statusId: this.postData.id,
            userName: userData.user_name
          },
          registration_ids: this.FCMtoken,
          priority: "high",
        }
        this.userservice.sendNotification(reqObj).subscribe((res) => {
          console.log(`res`, res);
          this.FCMtoken = [];
        });
      }
    } else {
      let likes: number = this.postData.likeCount;
      const totalLikes = likes ? likes + 1 : 1;
      this.postData.likeCount = totalLikes;
      if (this.postData && !this.postData.liked_user_ids) {
        this.postData.liked_user_ids = [];
        this.postData.liked_user_ids.push(this.botUserLikeForm.value.selectBot);
      }
      this.postData.liked_user_ids.push(this.botUserLikeForm.value.selectBot);
    }

    this.userservice.updateStatus(this.postData, this.currentPostId);
    this.toastr.success(this.isAlreadyLiked ? "Post unliked!" : "Post liked!");
    this.botUserLikeForm.reset();
    this.botUserLikeForm.setValue({ selectBot: "" });
    this.buttonName = "Like";
    this.isAlreadyLiked = false;
    document.getElementById("closeLikeModal")?.click();
  }

  public handleCancel() {
    this.botUserLikeForm.reset();
    this.botUserLikeForm.setValue({ selectBot: "" });
    this.botUserCommentForm.reset();
    this.botUserCommentForm.patchValue({ selectBot: "", comment: "" });

    this.buttonName = "Like";
    this.isAlreadyLiked = false;
    this.botUserSelected = false;
    this.blockUser = false;
  }

  public submitComment(): void {
    let comment: number = this.postData.commentCount;
    const totalComment = comment ? comment + 1 : 1;
    this.postData.commentCount = totalComment;
    this.botUserCommentForm
      .get("comment")
      .setValue(this.botUserCommentForm.value.comment.trim());
    if (this.botUserCommentForm.invalid) {
      return;
    }
    const commentUserObj = {
      comment_message: this.botUserCommentForm.value.comment.trim(),
      comment_messages: this.botUserCommentForm.value.comment,
      commented_user_id: this.botUserCommentForm.value.selectBot,
      commented_user_name: this.getBotUser(
        this.botUserCommentForm.value.selectBot
      )[0].user_name,
      comment_time: moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
    };
    if (this.botUserCommentForm.value) {
      this.userservice.updateStatus(this.postData, this.currentPostId);
      this.userservice.addComment(this.postData.id, commentUserObj);
      this.botUserCommentForm.reset();
      this.botUserCommentForm.patchValue({ selectBot: "", comment: "" });

      this.isAlreadyLiked = false; // hide Already liked post by this bot user! Error 
      this.buttonName = "Like";

      this.toastr.success("Comment added!");
      //Send comment notification
      const test = this.realUser.filter(
        (selectedUser) => selectedUser.id === this.postData.uid
      );
      if (test && test.length > 0) {
        this.FCMtoken.push(test[0].token);
      } else this.FCMtoken = [];
      let reqObj = {
        content_available: true,
        mutable_content: true,
        notification: {
          title: commentUserObj.commented_user_name,
          body: "Commented on your post :" + commentUserObj.comment_message,
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          id: commentUserObj.commented_user_id,
          status: 'done',
          type: 'status',
          statusId: this.postData.id,
          userName: commentUserObj.commented_user_name
        },
        registration_ids: this.FCMtoken,
        priority: "high",
      };
      this.userservice.sendNotification(reqObj).subscribe((res) => {
        this.FCMtoken = [];
        console.log(`res`, res);
      });
    }
    document.getElementById("closeModal")?.click();
  }

  public getBotUser(id: string) {
    return this.botLists.filter((item) => item.user_id === id);
  }

  //  handle like modal
  public handleLikeModal(data: any): void {
    this.currentPostId = data.id;
    this.postData = data;
    this.botUserLikeForm.reset();
    this.botUserLikeForm.setValue({ selectBot: "" });
  }

  // handle comment modal
  public handleCommentModal(data: any): void {
    this.disableComment = data?.disabled_comment;
    if (!this.disableComment) {
      this.currentPostId = data.id;
      this.postData = data;
    } else {
      this.toastr.warning("Comment for this post has been disabled");
    }
  }
}
