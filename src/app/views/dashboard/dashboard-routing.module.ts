import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddbotuserComponent } from '../addbotuser/addbotuser.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { RealuserComponent } from '../realuser/realuser.component';
import { ViewbotuserComponent } from '../viewbotuser/viewbotuser.component';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,

  },
  {
    path: 'user',
    component: AddbotuserComponent,
    children: [{

      path: 'user-detail',
      component: ViewbotuserComponent
    },
    {
      path: 'edit-user',
      component: EditUserComponent
    },
    ]
  },
  {
    path: 'real-user',
    component: RealuserComponent,
  },

];






@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
