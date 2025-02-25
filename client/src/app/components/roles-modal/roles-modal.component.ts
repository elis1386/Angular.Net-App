import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css',
})
export class RolesModalComponent {
  bsModalRef = inject(BsModalRef);
  title = '';
  availableRoles: string[] = [];
  selectedRoles: string[] = [];
  username = '';
  rolesUpdated = false;

  updatedChecked(checkedValue: string) {
    if (this.selectedRoles.includes(checkedValue)) {
      this.selectedRoles = this.selectedRoles.filter(
        (role) => role !== checkedValue,
      );
    } else {
      this.selectedRoles.push(checkedValue);
    }
  }

  onSelecteRoles() {
    this.rolesUpdated = true;
    this.bsModalRef.hide();
  }
}
