import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router, private snackBar: MatSnackBar) { }

  setItem(item: string, value: any) {
    return localStorage.setItem(item, JSON.stringify(value));
  }

  getItem(item: string) {
    return JSON.parse(localStorage.getItem(item) || '{}');
  }

  removeItem(item: string) {
    return localStorage.removeItem(item);
  }

  logout() {
    this.snackBar.open("Your session Expired", "Ok", { duration: 3000 });
    this.removeItem('tokens');
    sessionStorage.clear();
    this.router.navigate(['auth/sign-in']);
  }
}
