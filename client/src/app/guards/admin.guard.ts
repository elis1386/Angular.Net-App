import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  if (
    authService.roles().includes('Admin') ||
    authService.roles().includes('Moderator')
  ) {
    return true;
  } else {
    toastr.error('Oops');
    return false;
  }
};
