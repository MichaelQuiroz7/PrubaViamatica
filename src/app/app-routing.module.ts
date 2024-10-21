import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Coomponents
import { LoginComponent } from './Components/login/login.component';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login', component: LoginComponent },
  {path: 'sign-in', component: SignInComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'user', component: SignInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
