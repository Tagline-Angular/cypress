import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-viewbotuser',
  templateUrl: './viewbotuser.component.html',
  styleUrls: ['./viewbotuser.component.css']
})
export class ViewbotuserComponent implements OnInit {
  constructor(private userservice: UserService) { }

  ngOnInit(): void {
  }

}
