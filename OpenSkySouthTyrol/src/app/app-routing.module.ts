import { DeparturesComponent } from './departures/departures.component';
import { LogoutComponent } from './logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { ProductComponent } from './product/product.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignUpComponent },
  { path: "product", component: ProductComponent },
  { path: "impressum", component: AboutComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "logout", component: LogoutComponent },
  { path: "changepwd", component: ChangePasswordComponent },
  { path: "map", component: DashboardComponent },
  { path: "departure", component: DeparturesComponent },
  { path: "realtime", component: DashboardComponent },
  { path: "**", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
