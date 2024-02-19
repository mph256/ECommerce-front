import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth/auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  if(!authService.isAuthenticated()) {

    router.navigateByUrl('/sign-in');

    return false;

  }

  return true;

}
