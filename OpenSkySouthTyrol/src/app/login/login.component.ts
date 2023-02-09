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
  loading = false;
  submitted = false;
  //errors on login, shown to the user
  error:any = '';

  constructor( private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, private authenticationService: AuthenticationService ) {
    // redirect to dashboard if already logged in
    if (this.authenticationService.currentUserValue.id > 0) {
      this.router.navigate(['/convert/dashboard']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).pipe(first()).subscribe({
      next: () => {
        // get return url from route parameters or default to '/dashboard'
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/convert';
        this.router.navigate([returnUrl]);
      },
      error: error => {
        this.error = error;
        this.loading = false;
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
