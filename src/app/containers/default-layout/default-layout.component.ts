import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
 
})
export class DefaultLayoutComponent {
  constructor(private router:Router){}
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  public logout(){
    localStorage.removeItem('token');
    this.router.navigate([''])
  }
}
