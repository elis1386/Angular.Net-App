import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { MemberEditComponent } from '../components/member/member-edit/member-edit.component';
import { ConfirmService } from '../services/confirm.service';

export const preventUnsavedChangesGuard: CanDeactivateFn<
  MemberEditComponent
> = (component) => {
  const confirmService = inject(ConfirmService);

  if (component.editForm?.dirty) {
    return confirmService.confirm() ?? false;
  }

  return true;
};
