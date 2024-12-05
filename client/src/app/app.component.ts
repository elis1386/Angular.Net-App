import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Dating app';
  users = signal<any[]>([]);

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getUsers().subscribe(users => {
      this.users.set(users)
    });
  }
}
