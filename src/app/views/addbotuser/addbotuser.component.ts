import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../models/user.model";
import { UserService } from "../../shared/service/user.service";

@Component({
  selector: "app-addbotuser",
  templateUrl: "./addbotuser.component.html",
  styleUrls: ["./addbotuser.component.css"],
})
export class AddbotuserComponent implements OnInit {
  public Botuserform!: FormGroup;
  public users: any = [];
  public itsUpdate:boolean =true
  constructor(private userservice: UserService, private route: Router) {}

  ngOnInit(): void {
    this.Botuserform = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ])
    });
    this.getUserData();
  }

  onSubmit() {
    if (this.Botuserform.valid) {
      this.userservice.addUser(this.Botuserform.value).then((res: any) => {
        if(res){
          this.Botuserform.reset()
        }
      });
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
    if(confirm('are you sure you want to delete'))
    {
      this.userservice.remove(id);
    }
    this.getUserData();
  }

  // public updateUser(item: any): void {
  //    this.Botuserform.patchValue(item);
  //    this.userservice.updateuser(item)
  // }

  // public thirdfun(){
  //   if(this.itsUpdate)
  //   {
  //     this.updateUser("item")
      
  //   }
  //   else{
  //     this.onSubmit()
  //   }
  // }
}
