import { Component, inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  private toastr = inject(ToastrService);
  model: any = {};


  login() {
    this.authService.login(this.model).subscribe({
      next: () => this.router.navigate(['/members']),
      error: error => this.toastr.error(error.error)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  } 

}
