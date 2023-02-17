import { environment } from '@environments/environment';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  currentUser!: User;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.authenticationService.logout().subscribe(resp => {
      if (resp.response_code != 200) {
        console.log(resp);
      }
      else {
        localStorage.removeItem(environment.hashObject);
        this.router.navigate(['/login']);
      }
    });
  }

}
