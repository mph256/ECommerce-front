import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth/auth.service';

export const authorizationGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const roles = authService.getUserRoles();

  if(roles.indexOf(route.data['role']) === -1) {

    router.navigateByUrl('/home');

    return false;

  }

  return true;

}
