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
  public currentPostId: string = "";
  public botUserInfoListForm!: FormGroup;
  public filterUserList: any = [];

  public search: boolean = false;
  constructor(private userservice: UserService) {}

  ngOnInit(): void {
    this.createFormForBotList();
    this.getAllUserList();
    this.getBotUserList();
  }

  public searchByUserName(): void {
    this.filterUserList = this.users.filter(
      (item) => item.name === this.selectedtitle
    );
    console.log("this.filterUserList :>> ", this.filterUserList);
  }

  public createFormForBotList() {
    this.botUserInfoListForm = new FormGroup({
      selectBot: new FormControl(""),
      comment: new FormControl(""),
    });
  }

  public submitComment() {
    this.filterUserList = this.users.filter((ele: any) => {
      console.log(`ele`, ele);
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
  handleLikeModal(id: string) {
    this.currentPostId = id;
  }

  // handle comment modal
  handleCommentModal(id: string) {
    this.currentPostId = id;
    console.log(`id`, id);
  }
}
