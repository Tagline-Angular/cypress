import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../models/user.model";
import { UserService } from "../../shared/service/user.service";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: "app-addbotuser",
  templateUrl: "./addbotuser.component.html",
  styleUrls: ["./addbotuser.component.css"]
})
export class AddbotuserComponent implements OnInit {
  public Botuserform!: FormGroup;
  public users: any = [];
  public submit = 'Submit';
  public currentUserId:string = '';
  public itsUpdate: boolean = true;
  public buttonName = "Add"
  public h4="Add Bot User"
  constructor(private userservice: UserService, private route: Router, private toastr: ToastrService) { }

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
    this.itsUpdate = false
  } 

  

  onSubmit(operation: string) {
    console.log('operation :>> ', operation);
      if (this.currentUserId === '') {
        if (this.Botuserform.valid) {
          this.userservice.addUser(this.Botuserform.value).then((res: any) => {
            if (res) {
              this.toastr.success('User Data Added!');
              this.Botuserform.reset()
            }
          });
        }
      } 
      else {
        this.updateUser(this.Botuserform.value);
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
    if (confirm('are you sure you want to delete')) {
      this.userservice.remove(id);
      this.toastr.error('User Data Deleted!');
    }
    this.getUserData();
  }

  onEdit(item,id) {
    this.currentUserId = id;
    this.Botuserform.patchValue(item);
    this.h4="Update Bot User";
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  public updateUser(item): void {
    console.log(`===>item`, item.id)
    this.userservice.updateuser(item,this.currentUserId).then(res => console.log('res :>> ', res)).catch(err => console.log('err :>> ', err));
    this.toastr.success('User Data Update!');
    this.Botuserform.reset();
    this.h4 = 'Add Bot User';
  }

}
