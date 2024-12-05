import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api';

  constructor() { }

  getUsers() {
    return this.httpClient.get<any[]>(`${this.baseUrl}/users`);
  }
}
