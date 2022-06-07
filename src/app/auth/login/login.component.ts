import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/service/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public admin: any = []
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private toastr:ToastrService,
    private router:Router,
    private angularFireAuth : AngularFireAuth
    ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  get f(){
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.authService.getAdmin().subscribe((res) => {
      this.admin = res.map((e: any) => {
        return e.payload.doc.data();
      });
    })
  }

  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    if(this.loginForm.invalid){
      return;
    }

    if(this.admin[0].email === email && this.admin[0].password === password){
      this.angularFireAuth.signInWithEmailAndPassword(email,password).then((res)=>{ 
        const token = res.user?.refreshToken;
        localStorage.setItem('token',token);
        this.router.navigate(['dashboard']);
        this.toastr.success('Welcome Admin');
      }).catch((e)=>{
        console.log('Login error :>> ', e);
      })
    }
    else{
      this.toastr.error('Invalid credentials !');
    }
    
  }
}
