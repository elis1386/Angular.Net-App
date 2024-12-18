import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  cancelRegister = output<boolean>();
  model: any = {};

  register() {
    this.authService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: (error) => console.log(error),
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
