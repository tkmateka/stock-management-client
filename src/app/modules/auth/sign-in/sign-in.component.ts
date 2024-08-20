import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnDestroy {
  signInForm;
  tokenSubscription!: Subscription;
  userInfoSubscription!: Subscription;

  constructor(private snackBar: MatSnackBar, private router: Router, private api: ApiService, private token: TokenService) {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  submit(): void {
    if (this.signInForm.invalid) return;

    this.tokenSubscription = this.api.post('/login', this.signInForm.value)
      .subscribe({
        next: (res: any) => {
          if (res) {
            if (res.error) {
              this.snackBar.open(res.error, "Ok", { duration: 3000 });
              return;
            }

            this.snackBar.open(res.message, "Ok", { duration: 3000 });
            this.token.setItem('tokens', res);
            this.getUserInfo();
          }
        },
        error: err => this.snackBar.open(err.error, 'Ok', { duration: 3000 })
      });
  }

  getUserInfo() {
    this.userInfoSubscription = this.api.get(`/get_default_employee_by_email/${this.signInForm.value.email}`)
      .subscribe({
        next: (res: any) => {
          if (res) {
            sessionStorage.setItem('userInfo', JSON.stringify(res[0]));
            this.router.navigate(['base/dashboard']);
          }
        },
        error: err => this.snackBar.open(err.error, 'Ok', { duration: 3000 })
      })
  }

  ngOnDestroy() {
    this.tokenSubscription?.unsubscribe();
    this.userInfoSubscription?.unsubscribe();
  }
}
