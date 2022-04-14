import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-viewbotuser',
  templateUrl: './viewbotuser.component.html',
  styleUrls: ['./viewbotuser.component.css']
})
export class ViewbotuserComponent implements OnInit {
  // public users:any=[]
  constructor(private userservice:UserService) { }

  ngOnInit(): void {
  //  this.getUserData();
  }

  // public getUserData(): void {
  //   this.userservice.getUser().then((res: any) => {
  //     console.log('res :>> ', res);
  //      this.users = res;
  //   })
  // }
}
