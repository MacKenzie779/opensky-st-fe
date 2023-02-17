import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { ApiResponse } from './../_models/response';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  mySidebar:any = null;
  //login form in template
  loginForm!: FormGroup;
  //errors on login, shown to the user
  error:any = '';

  constructor( private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, private authenticationService: AuthenticationService ) {
    // redirect to dashboard if already logged in
    if (this.authenticationService.currentUserValue?.token?.length > 0) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.authenticationService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).subscribe(resp => {
      if (resp.response_code != 200) {
        this.error = resp.payload;
      }
      else {
        // creating user object
        let user = new User();
        user.token = resp.payload;
        user.username = this.loginForm.controls['username'].value;
        // setting user in local storage over auth service
        this.authenticationService.currentUserValue = user;
        // redirect
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      }
    });
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
