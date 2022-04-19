import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../shared/service/user.service";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.css"],
})
export class EditUserComponent implements OnInit {
  public editProductForm!: FormGroup;
  public editobj!: any;
  constructor(private userservice: UserService) {}

  ngOnInit(): void {
    this.editProductForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
    if (this.editobj) {
      // this.setuserValue()
    }
  }

  public onSubmit() {}
}
