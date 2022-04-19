import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../models/user.model";
import { UserService } from "../../shared/service/user.service";
import { ToastrService } from "ngx-toastr";
import { collectExternalReferences, isNgTemplate } from "@angular/compiler";
import * as moment from "moment";
@Component({
  selector: "app-addbotuser",
  templateUrl: "./addbotuser.component.html",
  styleUrls: ["./addbotuser.component.css"],
})
export class AddbotuserComponent implements OnInit {
  public Botuserform!: FormGroup;
  public users: any = [];
  public submit = "Submit";
  public currentUserId: string = "";
  public itsUpdate: boolean = true;
  public buttonName = "Add";
  public h4 = "Add Bot User";
  public filterUserList: any = [];
  constructor(
    private userservice: UserService,
    private route: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.Botuserform = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]),
    });
    this.getUserData();
    this.itsUpdate = false;
  }

  onSubmit() {
    if (this.Botuserform.valid) {
      const duplicateRecord = this.users.filter(
        (item) =>
          item.name === this.Botuserform.value.name ||
          item.email === this.Botuserform.value.email
      );
      if (duplicateRecord.length > 0) {
        this.toastr.error("Duplicate record added! Please try with different Email/Name.");
      } else {
        if (this.currentUserId) {
          this.updateUser(this.Botuserform.value);
        } else {
          const data1 = {
            name: this.Botuserform.value.name,
            email: this.Botuserform.value.email,
            date: moment().format("YYYY-MM-DD HH:MM:SS.SSSSSS"),
          }
          // console.log('date :>> ', this.date);
          console.log('data1 :>> ', data1);
          this.userservice.addUser(data1).then((res: any) => {
            if (res) {
              this.toastr.success("User added!");
              this.Botuserform.reset()
            }
          });
        }
      }
    }
  }

  public getUserData(): void {
    this.userservice.getUser().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  public deleteUser(id): void {
    this.userservice.remove(id);
    this.toastr.success("User deleted!");
    this.getUserData();
  }

  onEdit(item, id) {
    this.currentUserId = id;
    this.Botuserform.patchValue(item);
    this.h4 = "Update Bot User";
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  public updateUser(item): void {
    console.log(`===>item`, item.id);
    this.userservice
      .updateuser(item, this.currentUserId)
      .then((res) => {
        console.log("res :>> ", res);
        this.toastr.success("User updated!");
      })
      .catch((err) => {
        console.log("err :>> ", err);
        this.toastr.error("Something went wrong");
      });
    this.Botuserform.reset();
    this.currentUserId = "";
    this.h4 = "Add Bot User";
  }
}
