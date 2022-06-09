import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { DownloadTrueconvosComponent } from './download-trueconvos/download-trueconvos.component';
import { AuthGuard } from './guard/auth.guard';
import { AddbotuserComponent } from './views/addbotuser/addbotuser.component';

export const routes: Routes = [
  {
    path:'',
    loadChildren:() => import('./auth/auth.module').then(a=>a.AuthModule)
  }
  ,
  {
    path: 'dashboard',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  {
    path:'download/:id',
    component:DownloadTrueconvosComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
