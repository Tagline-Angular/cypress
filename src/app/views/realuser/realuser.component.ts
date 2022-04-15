import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-realuser',
  templateUrl: './realuser.component.html',
  styleUrls: ['./realuser.component.css']
})
export class RealuserComponent implements OnInit {
  public selectedtitle: string = '';
  public users: any = [];
  public filterUserList: any = [];

  public search: boolean = false;
  constructor(private userservice: UserService) { }

  ngOnInit(): void {
    this.getAllUserList()
  }

  public searchByUserName(): void {
    this.filterUserList = this.users.filter(item => item.name === this.selectedtitle);
    console.log('this.filterUserList :>> ', this.filterUserList);

  }

  private getAllUserList(): void {
    this.userservice.getAllUser().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
      console.log('this.users :>> ', this.users);
    });

  }

  public userLike(): void {
    this.userservice.getUser().subscribe((data) => {
      this.users = data.map((e) => {
        return Object.assign({ id: e.payload.doc.id }, e.payload.doc.data());
      });
    });
  }

  public addLike(item) {
    console.log('id :>> ', item);
    //  this.userservice.updateStatus()
  //   this.userservice.updateStatus(item.likeCount, item.liked_user_ids).then((res) => {
  //     console.log('res :>> ', res);
  //   })
   }
}
