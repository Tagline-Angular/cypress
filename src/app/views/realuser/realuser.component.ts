import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AnyRecord } from "dns";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../shared/service/user.service";

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
  public botUserLikeForm: FormGroup;
  public realUserList!: FormGroup;
  public filterUserList: any = [];
  public postData: any;

  public search: boolean = false;
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

  public searchByUserName(): void {
    this.filterUserList = this.users.filter(
      (item) => item.name === this.realUserList.value.selectRealUser
    );
    this.selectedtitle = this.realUserList.value.selectRealUser;
    console.log('selectedtitle :>> ', this.selectedtitle);
    // this.realUserList.reset()
  }

  public createFormForBotList(): void {
    this.botUserCommentForm = new FormGroup({
      selectBot: new FormControl(""),
      comment: new FormControl(""),
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
    // console.log('=====>>>>>>this.postData? :>> ', this.postData);
    console.log("comment :>> ", comment);
    const totalComment = comment ? comment + 1 : 1;
    console.log("totalComment :>> ", totalComment);
    this.postData.commentCount = totalComment;
    console.log("this.postData.id :>> ", this.postData.id);
    this.botUserCommentForm.reset();
    this.userservice.updateStatus(this.postData, this.currentPostId);
    this.toastr.success("Comment added!");
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
