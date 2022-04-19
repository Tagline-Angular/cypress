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

  public search: boolean = false;
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
        return e.payload.doc.data();
      });
    });
    this.selectedtitle = this.users.filter(
      (item) => item.id === id)[0].user_name;
    // this.realUserList.reset()
  }

  public createFormForBotList(): void {
    this.botUserCommentForm = new FormGroup({
      selectBot: new FormControl("", Validators.required),
      comment: new FormControl("", Validators.required),
    });
    this.botUserLikeForm = new FormGroup({
      selectBot: new FormControl(""),
    });
  }

  public createFormForRealUserList(): void {
    this.realUserList = new FormGroup({
      selectRealUser: new FormControl(" "),
    });
  }

  public getBotUserList(): void {
    this.userservice.getUser().subscribe((data) => {
      this.botLists = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  private getAllUserList(): void {
    this.userservice.getAllUser().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  public submitLike(): void {
    let likes: number = this.postData.likeCount;
    const totalLikes = likes ? likes + 1 : 1;
    this.postData.likeCount = totalLikes;
    if (!this.postData.liked_user_ids) this.postData.liked_user_ids = [];
    this.postData.liked_user_ids.push(this.botUserLikeForm.value.selectBot);
    this.userservice.updateStatus(this.postData, this.currentPostId);
    this.botUserLikeForm.reset();
    this.toastr.success("Like added!");
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
    this.userservice.updateStatus(this.postData, this.currentPostId);
    this.userservice.addComment(this.postData.id, commentUserObj);
    this.botUserCommentForm.reset();
    this.toastr.success("Comment added!");
    this.realUserList.reset();
  }

  public getBotUser(id: string) {
    return this.botLists.filter((item) => item.id === id);
  }

  //  handle like modal
  public handleLikeModal(data: any): void {
    this.currentPostId = data.id;
    this.postData = data;
  }

  // handle comment modal
  public handleCommentModal(data: any): void {
    this.currentPostId = data.id;
    this.postData = data;
  }
}
