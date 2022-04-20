import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { UserService } from "./../../shared/service/user.service";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-botuserpost",
  templateUrl: "./botuserpost.component.html",
  styleUrls: ["./botuserpost.component.css"],
})
export class BotuserpostComponent implements OnInit {
  public botUserPostForm!: FormGroup;
  public submit = "Submit";
  public botLists: any = [];
  public currentDate: any = new Date()
  public h4 = "Add Bot User Post";
  public botPostsList: any = []

  constructor(
    private userservice: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.botUserPostForm = new FormGroup({
      selectBotUser: new FormControl(null, [Validators.required]),
      comment: new FormControl(null, [Validators.required]),
    });
    this.getBotUserList();
  }

  onSubmit() {
    // var utc = new Date(this.currentDate.toUTCString().slice(0, -4));
    // console.log('utc :>> ',utc);
    // console.log('this.currentDate :>> ', this.currentDate);
    const time = moment().utc().format(`MMMM D, yyyy h:mm:ss A z`);
    console.log('time :>> ', time);

    const botUserData = this.botLists.filter((e) => e.id === this.botUserPostForm.value?.selectBotUser);
    console.log('botUserdata :>> ', botUserData);
    if (this.botUserPostForm.valid) {
      const data1 = {
        align: 2,
        category: 'Sad',
        commentCount: 0,
        likeCount: 0,
        liked_user_ids: [],
        name: botUserData[0]?.name,
        style_color: 4278190080,
        style_font: 'OpenSans',
        style_size: 20,
        text: this.botUserPostForm.value.comment,
        // time: moment().format("MMMM d, y, h:mm:ss a z"),
        time: moment().utc().format(`MMMM D, yyyy h:mm:ss A z`),
        type: 'text',
        uid: botUserData[0]?.id
      };
      console.log('data1 :>> ', data1);
      this.userservice.addBotUserPost(data1).then((res: any) => {
        if (res) {
          console.log('res :>> ', res);
          this.toastr.success("Post added!");
          this.botUserPostForm.reset();
          // this.getUserData();
        }
      });
    }
    this.userservice.getPostByUser(botUserData[0]?.id).subscribe((posts) => {
      this.botPostsList = posts.map((e) => {
        return e.payload.doc.data();
      });
      console.log('this.botPostsList :>> ', this.botPostsList);
      // this.isUserPost = true;
    });
  }

  public getBotUserList(): void {
    this.userservice.getUser("name", "asc").subscribe((data) => {
      this.botLists = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  // public getPostForUser(): void {
  //   const id = this.botUserPostForm.value.selectRealUser;
  //   this.userservice.getPostByUser(id).subscribe((posts) => {
  //     this.botPostsList = posts.map((e) => {
  //       return e.payload.doc.data();
  //     });
  //     console.log('this.botPostsList :>> ', this.botPostsList);
  //     // this.isUserPost = true;
  //   });
  //   // this.selectedtitle = this.users.filter(
  //   //   (item) => item.id === id
  //   // )[0].user_name;
  // }
}
