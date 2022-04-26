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
  constructor(
    private userservice: UserService,
    private toastr: ToastrService
  ) { }

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
      this.isUserPost = true;
    });
    this.selectedtitle = this.users.filter(
      (item) => item.id === id
    )[0].user_name;
  }

  public createFormForBotList(): void {
    this.botUserCommentForm = new FormGroup({
      selectBot: new FormControl("", Validators.required),
      comment: new FormControl("", Validators.required),
    });
    this.botUserLikeForm = new FormGroup({
      selectBot: new FormControl("", Validators.required),
    });
    this.botUserunLikeForm = new FormGroup({})
  }

  public createFormForRealUserList(): void {
    this.realUserList = new FormGroup({
      selectRealUser: new FormControl(),
    });
  }

  public getBotUserList(): void {
    this.userservice.getUser("name", "asc").subscribe((data) => {
      this.botLists = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      console.log('this.botLists', this.botLists)
    });
  }

  private getAllUserList(): void {
    this.userservice.getAllUser().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  // select method for bot selector
  selectBotUser(event) {
    this.botUserSelected = true;
    if (this.postData.liked_user_ids && this.postData.liked_user_ids.includes(event.target.value)) {
      this.buttonName = "UnLike";
      this.isAlreadyLiked = true;
    } else {
      this.isAlreadyLiked = false;
      this.buttonName = "Like";
    }

    // if (this.postData.blocked_users && this.postData.blocked_users.includes(event.target.value)) {
    //   this.blockUser=true;
    // } else {
    //   this.blockUser = false;
    // }
  }

  public submitLikeUnlike() {
    if (this.botUserSelected) {
      if (this.isAlreadyLiked) {
        const likes: number = this.postData.likeCount;
        const totalLikes = likes ? likes - 1 : 1;
        this.postData.likeCount = totalLikes;
        // remove liked user id from array
        const index = this.postData.liked_user_ids.indexOf(this.botUserLikeForm.value.selectBot);
        if (index > -1) {
          this.postData.liked_user_ids.splice(index, 1);
        }
      } else {
        let likes: number = this.postData.likeCount;
        const totalLikes = likes ? likes + 1 : 1;
        this.postData.likeCount = totalLikes;
        this.postData.liked_user_ids.push(this.botUserLikeForm.value.selectBot);
      }
    } else {
      let likes: number = this.postData.likeCount;
      const totalLikes = likes ? likes + 1 : 1;
      this.postData.likeCount = totalLikes;
      if (this.postData && !this.postData.liked_user_ids) {
        this.postData.liked_user_ids = [];
      }
      console.log('this.postData', this.postData)
      this.postData.liked_user_ids.push(this.botUserLikeForm.value.selectBot);
    }
    // this.botLists.
    this.userservice.updateStatus(this.postData, this.currentPostId);
    this.toastr.success(this.isAlreadyLiked ? 'Post unliked!' : 'Post liked!');
    this.botUserLikeForm.reset();
    this.buttonName = 'Like';
    this.isAlreadyLiked = false;
  }

  public handleCancel() {
    this.botUserLikeForm.reset();
    this.botUserCommentForm.reset();
    this.buttonName = 'Like';
    this.isAlreadyLiked = false;
    this.botUserSelected = false; 
  }

  public submitComment(): void {
    let comment: number = this.postData.commentCount;
    const totalComment = comment ? comment + 1 : 1;
    this.postData.commentCount = totalComment;
    const commentUserObj = {
      comment_message: this.botUserCommentForm.value.comment,
      commented_user_id: this.botUserCommentForm.value.selectBot,
      commented_user_name: this.getBotUser(
        this.botUserCommentForm.value.selectBot
      )[0].name,
      comment_time: moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
    };
    if (this.botUserCommentForm.value) {
      this.userservice.updateStatus(this.postData, this.currentPostId);
      this.userservice.addComment(this.postData.id, commentUserObj);
      this.botUserCommentForm.reset();
      this.toastr.success("Comment added!");
    }
  }

  public getBotUser(id: string) {
    return this.botLists.filter((item) => item.id === id);
  }

  //  handle like modal
  public handleLikeModal(data: any): void {
    console.log('data', data)
    this.currentPostId = data.id;
    this.postData = data;
  }

  // handle comment modal
  public handleCommentModal(data: any): void {
    console.log('data', data)
    this.disableComment = data?.disabled_comment;
    // if (!this.disableComment && this.disableComment == undefined) {
    //   this.currentPostId = data.id;
    //   this.postData = data;
    // } else {
    //   this.toastr.warning("Comment for this post has been disabled");
    // }
  }
}
