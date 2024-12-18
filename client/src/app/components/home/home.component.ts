import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  regigsterMode = false;
  authService = inject(AuthService);
  users: any = signal<any[]>([]);

  ngOnInit() {
    this.getUsers();
  }

  registerToggle() {
    this.regigsterMode = !this.regigsterMode;
  }
  
  cancelRegisterMode(event: boolean) {
    this.regigsterMode = event;
  }
  
  getUsers() {
    this.authService.getUsers().subscribe((users) => {
      this.users.set(users);
    });
  }

}
