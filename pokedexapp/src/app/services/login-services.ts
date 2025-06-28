import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.type';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginServices {
  authState = signal<boolean>(false)
  user = signal<User | null>(null)
  http = inject(HttpClient)
  loginUser(user: User): Observable<any> {
    const url = 'http://127.0.0.1:5000/user/login'
    return this.http.post<any>(url, user).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('jwt_token', res.token)
          this.authState.set(true)
          this.user.set(res.data)

        }
      })
    )
  }
  registerUser(user: User): Observable<any> {
    const url = 'http://127.0.0.1:5000/users/create'
    return this.http.post<any>(url, user)
  }
  logout(): void {
    localStorage.removeItem('jwt_token');
    this.authState.set(false)
  }
  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}
