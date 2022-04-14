import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-addbotuser',
  templateUrl: './addbotuser.component.html',
  styleUrls: ['./addbotuser.component.css']
})
export class AddbotuserComponent implements OnInit {
  public Botuserform!: FormGroup
  public users: any = []
  item: any;
  constructor(private userservice: UserService, private route: Router) {

  }

  ngOnInit(): void {
    this.Botuserform = new FormGroup({
      name: new FormControl(null, [
        Validators.required,

      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-z]).{6,32}$'),
      ])
    });
    this.getUserData();
  }

  onSubmit() {
    this.userservice.addUser(this.Botuserform.value).then((res: any) => {

    })

  }

  public getUserData(): void {
    this.userservice.getUser().then((res: any) => {
      console.log('res :>> ', res);
      this.users = res;
    })
  }

  public deleteUser(id): void {
    console.log('id :>> ', id)
     this.userservice.remove(id);
     this.getUserData()
  }

  
  // public updateProduct(user: any): void {
  //   localStorage.setItem('updateProductDetail', JSON.stringify(user));
  //   this.route.navigate(['/dashboard/user']);
  // }

}
