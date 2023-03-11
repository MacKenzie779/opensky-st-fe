import { NotFoundComponent } from './not-found/not-found.component';
import { RealtimeComponent } from './realtime/realtime.component';
import { MapComponent } from './map/map.component';
import { HistoricDeparturesComponent } from './historic-departures/historic-departures.component';
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
import { AuthGuard } from './_helpers';
import { FlightComponent } from './flight/flight.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignUpComponent },
  { path: "product", component: ProductComponent },
  { path: "impressum", component: AboutComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "logout", component: LogoutComponent, canActivate: [AuthGuard] },
  { path: "changepwd", component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: "departure", component: DeparturesComponent, canActivate: [AuthGuard] },
  { path: "realtime", component: RealtimeComponent, canActivate: [AuthGuard] },
  { path: "flight/:code", component: FlightComponent, canActivate: [AuthGuard] },
  { path: "404/:redirect", component: NotFoundComponent },
  { path: "departure/history", component: HistoricDeparturesComponent, canActivate: [AuthGuard] },
  { path: "map", component: MapComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
