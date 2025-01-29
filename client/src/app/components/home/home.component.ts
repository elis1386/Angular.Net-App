import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  regigsterMode = false;

  registerToggle() {
    this.regigsterMode = !this.regigsterMode;
  }

  cancelRegisterMode(event: boolean) {
    this.regigsterMode = event;
  }
}
