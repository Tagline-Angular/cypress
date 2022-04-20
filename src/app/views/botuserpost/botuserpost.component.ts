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
  public h4 = "Add Bot User Post";

  constructor(
    private userservice: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.botUserPostForm = new FormGroup({
      selectBotUser: new FormControl(null, [Validators.required]),
      comment: new FormControl(null, [Validators.required]),
    });
    this.getBotUserList();
  }

  onSubmit() {
    if (this.botUserPostForm.valid) {
      const data1 = {
        name: this.botUserPostForm.value.selectBotUser,
        email: this.botUserPostForm.value.comment,
        date: moment().format("MMMM d, y, h:mm:ss a z"),
      };

      // this.userservice.addUser(data1).then((res: any) => {
      //   if (res) {
      //     this.toastr.success("User added!");
      //     this.botUserPostForm.reset();
      //     // this.getUserData();
      //   }
      // });
    }
    this.botUserPostForm.reset();
  }

  public getBotUserList(): void {
    this.userservice.getUser("name", "asc").subscribe((data) => {
      this.botLists = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }
}
