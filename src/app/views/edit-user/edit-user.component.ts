import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  public editProductForm!: FormGroup;
  public editobj!: any;
  constructor(private userservice:UserService) { }

  ngOnInit(): void {
    const editDetail: any = localStorage.getItem('updateProductDetail');
    this.editobj = JSON.parse(editDetail)
    localStorage.getItem('updateProductDetail');
    this.editProductForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
      
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        
      ]),
      password: new FormControl(null, [
        Validators.required,
      ])
     
    });
    if(this.editobj){
      this.setuserValue()
    }
  }

  public setuserValue(): void {
    this.editProductForm.setValue({
      name: this.editobj.name,
      email: this.editobj.email,
      password:this.editobj.password
    })
  }
  
  // public onSubmit(){
  //   this.userservice.userUpdate(this.editobj._id,this.editProductForm.value).then((res:any)=>{
  //     console.log('update res :>> ', res);
  //   })
  // }
}
