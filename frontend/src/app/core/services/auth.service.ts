import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, User } from '../models/auth.models';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    currentUser = signal<User | null>(this.getUserFromStorage());

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: any) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => this.handleAuth(res))
        );
    }

    register(userData: any) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
            tap(res => this.handleAuth(res))
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    private handleAuth(res: AuthResponse) {
        if (res.token) {
            localStorage.setItem('token', res.token);
            const user: User = { username: res.username, role: res.role };
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUser.set(user);
        }
    }

    private getUserFromStorage(): User | null {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'ADMIN';
    }
}
