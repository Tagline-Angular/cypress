import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-realuser',
  templateUrl: './realuser.component.html',
  styleUrls: ['./realuser.component.css']
})
export class RealuserComponent implements OnInit {
  selectedtitle: string = '';
  constructor() { }

  ngOnInit(): void {
   
  }

  searchByBrand(){
    console.log('selectedtitle :>> ', this.selectedtitle);
  }
}
