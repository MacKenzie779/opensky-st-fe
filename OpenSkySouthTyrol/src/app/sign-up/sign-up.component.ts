import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '@app/_helpers';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
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

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    },
    {
      validator: MustMatch('password', 'passwordRepeat')
    }
    );
  }

  get field () {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.authenticationService.signup(this.field['username'].value, this.field['email'].value, this.field['password'].value).subscribe(
      resp => {
        if (resp.response_code != 200) {
          this.error = resp.payload;
        }
        else {
          this.authenticationService.login(this.field['username'].value, this.field['password'].value).subscribe(
            resp => {
              if (resp.response_code == 200) {
                // creating user object
                let user = new User();
                user.token = resp.payload;
                user.username = this.field['username'].value;
                // setting user in local storage over auth service
                this.authenticationService.currentUserValue = user;
                // redirect
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
                this.router.navigate([returnUrl]);
              }
            }
          )
        }
      }
    );
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
