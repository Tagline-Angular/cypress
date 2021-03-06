import { AnnouncementComponent } from './../announcement/announcement.component';
import { BotuserpostComponent } from './../botuserpost/botuserpost.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddbotuserComponent } from '../addbotuser/addbotuser.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { RealuserComponent } from '../realuser/realuser.component';
import { InfluencersComponent } from '../influencers/influencers.component';

const routes: Routes = [
  {
    path: "",
    // component: AddbotuserComponent,
    redirectTo: "user",
  },
  {
    path: "user",
    component: AddbotuserComponent,
    children: [],
  },
  {
    path: "edit-user",
    component: EditUserComponent,
  },
  {
    path: "real-user",
    component: RealuserComponent,
  },
  {
    path: "bot-post",
    component: BotuserpostComponent,
  },
  {
    path: "announcement",
    component: AnnouncementComponent,
  },
  {
    path: "influencers",
    component: InfluencersComponent,
  }
];






@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
