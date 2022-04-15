import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
  public cuurentUserId:string = '';
  public currentPostId: string = "";
  public botUserInfoListForm!: FormGroup;
  public realUserList!: FormGroup;
  public filterUserList: any = [];

  public search: boolean = false;
  constructor(private userservice: UserService) {}

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
  }

  public createFormForBotList() {
    this.botUserInfoListForm = new FormGroup({
      selectBot: new FormControl(""),
      comment: new FormControl(""),
    });
  }

  public createFormForRealUserList() {
    this.realUserList = new FormGroup({
      selectRealUser: new FormControl(""),
    });
  }

  public submitComment() {
    this.userservice.getAllUser().subscribe((data) => {
      const commentCount = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      commentCount.forEach((ele:any) => {
        if(ele?.uid === this.currentPostId){
          console.log(`this.currentPostId`, this.currentPostId)
          console.log(`ele`, ele)
        } else {
          console.log(`this.currentPostId`, this.currentPostId)
          console.log(" ====>object")
        }
      })
      // console.log(`commentCount`, commentCount);
    });
    const botCommentObj = {
      name: this.botUserInfoListForm.value.selectBot,
      comment: this.botUserInfoListForm.value.comment,
      botUserId: this.currentPostId,
    };
    this.botUserInfoListForm.reset();
  }

  public getBotUserList() {
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

  public userLike(): void {
    this.userservice.getUser().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  public submitLike() {}

  //  handle like modal
  public handleLikeModal(id: string) {
    this.currentPostId = id;
  }

  // handle comment modal
  public handleCommentModal(id: string) {
    this.currentPostId = id;
    console.log(`id`, id);
  }

}
