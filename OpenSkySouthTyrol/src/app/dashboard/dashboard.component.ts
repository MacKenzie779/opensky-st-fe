import { UrlService } from './../_services/url.service';
import { Component } from '@angular/core';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  headertext:string;
  subtext:string;

  mySidebar:any = null;
  menu:boolean = false;
  username:string;

  constructor(public authService: AuthenticationService, private url: UrlService) {
    this.username = this.authService.currentUserValue.username;
    if (this.url.getPreviousUrl() == undefined || this.url.getPreviousUrl() == "/signup" || this.url.getPreviousUrl() == "/login") {
      this.headertext = "Hello "+this.username+"!";
      this.subtext = "Welcome to OpenSky South Tyrol! What do you want to do next?";
    }
    else {
      this.headertext = "Hello again ;)";
      this.subtext = "What do you want to do next?";
    }
  }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.menu = !this.menu;
  }

  open_sidebar(): void {
    this.mySidebar = document.getElementById("mySidebar");
    if (this.mySidebar.style.display === 'block') {
      this.mySidebar.style.display = 'none';
    } else {
      this.mySidebar.style.display = 'block';
    }
  }

  close_sidebar(): void {
    this.mySidebar.style.display = "none";
  }

}
