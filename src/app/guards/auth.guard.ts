import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {

  const token = inject(TokenService);
  const router = inject(Router)

  console.log(token.getItem('userInfo'))

  if (Object.keys(token.getItem('userInfo')).length)
    return true;
  else
    router.navigate(['auth/sign-in'])
    return false
};
