import { AuthenticationService } from '@app/_services/authentication.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '@app/_helpers';
import { User } from '@app/_models';
import { first } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  menu:boolean = false;

  mySidebar:any = null;
  //login form in template
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  //errors on login, shown to user
  error:any = '';
  isError:boolean = true;


  constructor( private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, public authService: AuthenticationService ) {

    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      oldpwd: ['', Validators.required],
      newpwd: ['', Validators.required],
      newpwdRepeat: ['', Validators.required]
    },
    {
      validator: MustMatch('newpwd', 'newpwdRepeat')
    });
  }

  get field () {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    var user = this.authService.currentUserValue['username'];
    console.log(user);
    this.authService.changepwd(this.loginForm.controls['newpwd'].value).subscribe(resp => {
      if (resp.response_code != 200) {
        this.error = resp.payload;
      }
      else {
        this.isError = false;
        this.error = "Password changed succesfully!";
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
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


  toggleMenu() {
    this.menu = !this.menu;
  }
}
