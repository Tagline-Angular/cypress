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
    // cuurentUserId 
    console.log(`this.filterUserList`, this.filterUserList)
    this.filterUserList = this.users.filter(
      (item) => item.name === this.realUserList.value.selectRealUser
    );
    console.log("this.filterUserList :>> ", this.filterUserList);
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

  
  public submitLike() {
    // this.userservice.updateStatus()
    // console.log('item :>> ', item);
    // const a=this.userservice.updateStatus(item.likeCount, item.liked_user_id)
    // console.log('a :>> ', a);
  }

  

  //  handle like modal
  handleLikeModal(id: string) {
    console.log('id :>> ', id)
    this.currentPostId = id;
  }

  // handle comment modal
  handleCommentModal(id: string) {
    this.currentPostId = id;
    console.log(`id`, id);
  }
}
