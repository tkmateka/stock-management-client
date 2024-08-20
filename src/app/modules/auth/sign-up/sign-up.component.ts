import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnDestroy {
  signUpForm: FormGroup;
  registerSubsription!: Subscription;

  constructor(private snackBar: MatSnackBar, private router: Router, private api: ApiService) {
    const validatePasswordMatch = (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.signUpForm?.get('password')?.value as string;
      const passwordConfirm = control.value as string;

      if (password !== passwordConfirm) {
        return { passwordMatch: true };
      }

      return null;
    };

    this.signUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      image: new FormGroup({
        name: new FormControl(''),
        path: new FormControl('')
      }),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, validatePasswordMatch]),
    });
  }

  submit(): void {
    if (this.signUpForm.invalid) return;

    let userInfo = this.signUpForm.value;
    delete userInfo.confirmPassword;

    this.registerSubsription = this.api.post('/register', this.signUpForm.value)
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.snackBar.open(res.message, "Ok", { duration: 3000 });
            this.router.navigate(['auth/sign-in']);
          }
        }, 
        error: err => console.log(err)
      });
  }

  ngOnDestroy() {
    this.registerSubsription?.unsubscribe();
  }
}
