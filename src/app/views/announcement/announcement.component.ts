import { UserService } from "./../../shared/service/user.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-announcement",
  templateUrl: "./announcement.component.html",
  styleUrls: ["./announcement.component.css"],
})
export class AnnouncementComponent implements OnInit {
  public announcementForm!: FormGroup;
  public users: any = [];
  public FCMtoken: any = [];
  public FCMChunkedList: any = [];
  public subscriptionArr: Subscription[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.announcementForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUserList().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  chunk(data, size) {
    this.FCMChunkedList = data.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(data.slice(i, i + size));
      return acc;
    }, []);
  }

  onSend() {
    let userSubscription = this.users.map((user: any) => {
      if (!this.FCMtoken.includes(user.token)) {
        this.FCMtoken.push(user.token);
      }
      this.handleNotificationSending(user);
    });
    this.subscriptionArr.push(userSubscription);
  }

  handleNotificationSending(user: any) {
    if (user) {
      this.chunk(this.FCMtoken, 500);
      const announcemnetData = this.announcementForm.value;
      let reqObj = {
        content_available: true,
        mutable_content: true,
        notification: {
          title: announcemnetData.title,
          body: announcemnetData.description,
        },
        data: {
          lick_action: "FLUTTER_NOTIFICATION_CLICK",
          id: user._user_id,
          status: "done",
          type: "status",
          userName: user.user_name,
        },
        registration_ids: this.FCMChunkedList,
        priority: "high",
      };
      this.FCMChunkedList.forEach((data) => {
        reqObj.registration_ids = data;
        this.FCMtoken = [];
        this.userService.sendNotification(reqObj).subscribe((res) => {
          this.announcementForm.reset();
        });
      });
    } else {
      console.log("User not found");
    }
  }

  ngOnDestroy() {
    this.subscriptionArr.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
