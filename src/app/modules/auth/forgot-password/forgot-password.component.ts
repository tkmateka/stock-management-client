import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  emailForm;
  verifyForm;
  createNewPasswordForm;

  otpSubscription!: Subscription;

  verifyCode: boolean = false;
  setNewPassword: boolean = false;

  constructor(private snackBar: MatSnackBar, private router: Router, private api: ApiService, private token: TokenService) {
    const validatePasswordMatch = (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.createNewPasswordForm?.get('new_password')?.value as string;
      const passwordConfirm = control.value as string;

      if (password !== passwordConfirm) {
        return { passwordMatch: true };
      }

      return null;
    };

    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required])
    });

    this.verifyForm = new FormGroup({
      verification_code: new FormControl('', [Validators.required])
    });

    this.createNewPasswordForm = new FormGroup({
      new_password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, validatePasswordMatch]),
    });
  }

  submit(): void {
    if (this.emailForm.invalid) return;

    this.otpSubscription = this.api.post('/forgot_Password', this.emailForm.value)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.snackBar.open(res.message, "Ok", { duration: 3000 });
            this.verifyCode = true;
          }
        },
        error: err => this.snackBar.open(err.error, 'Ok', { duration: 3000 })
      });
  }

  verify(): void {
    if (this.verifyForm.invalid) return;

    this.api.post('/verify_code', this.verifyForm.value)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.snackBar.open(res.message, "Ok", { duration: 3000 });
            this.setNewPassword = true;
          }
        },
        error: err => this.snackBar.open(err.error, 'Ok', { duration: 3000 })
      });
  }

  resetPassword(): void {
    if (this.createNewPasswordForm.invalid) return;

    const body = {
      new_password: this.createNewPasswordForm.get('new_password')?.value,
      email: this.emailForm.get('email')?.value
    }

    this.api.post('/change_password', body)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.router.navigate(['auth/sign-in']);
          }
        },
        error: err => this.snackBar.open(err.error, 'Ok', { duration: 3000 })
      });
  }

  ngOnDestroy() {
    this.otpSubscription?.unsubscribe();
  }
}
