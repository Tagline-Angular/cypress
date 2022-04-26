import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
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
  public h4 = "Add Bot-User Post";
  public botPostsList: any = [];

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
    this.getAllPosts();
  }

  onSubmit() {
    const botUserData = this.botLists.filter(
      (e) => e.id === this.botUserPostForm.value?.selectBotUser
    );
    if (this.botUserPostForm.valid) {
      const data1 = {
        align: 2,
        category: "Sad",
        commentCount: 0,
        likeCount: 0,
        liked_user_ids: [],
        name: botUserData[0]?.user_name,
        style_color: 4278190080,
        style_font: "OpenSans",
        style_size: 20,
        text: this.botUserPostForm.value.comment,
        time: moment(moment().format("MMMM DD, YYYY, h:mm:ss a")).toDate(),
        type: "text",
        uid: botUserData[0]?.id,
      };
      this.userservice.addBotUserPost(data1).then((res: any) => {
        if (res) {
          this.toastr.success("Post added!");
          this.botUserPostForm.reset();
          this.getAllPosts();
        }
      });
    }
  }

  public getBotUserList(): void {
    this.userservice.getUser("user_name", "asc").subscribe((data) => {
      this.botLists = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      console.log('botLists :>> ', this.botLists);
    });
  }

  public getAllPosts() {
    this.userservice.getAllUserPosts().subscribe((res) => {
      this.botPostsList = res.map((e) => {
        return e.payload.doc.data();
      });
    });
  }

  static noWhiteSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string)?.indexOf(' ') >= 0) {
      return { noWhiteSpace: true }
    }
    return null;
  }
}
