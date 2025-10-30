import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';
import * as http from 'node:http';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  console.log('localStorage is', typeof sessionStorage);
  // Verificăm dacă suntem în browser (unde există localStorage)
  if (typeof sessionStorage === 'undefined') {
    return router.createUrlTree(['/auth/login']);
  }

  const loggedIn = sessionStorage.getItem("loggedIn");

  if (!loggedIn)
    return router.createUrlTree(['/auth/login']);

  return true;
};
