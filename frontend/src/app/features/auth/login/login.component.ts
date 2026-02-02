import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to plan your next adventure</p>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" [(ngModel)]="credentials.username" required #username="ngModel">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" [(ngModel)]="credentials.password" required #password="ngModel">
          </div>
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" [disabled]="!loginForm.form.valid || loading" class="btn-submit">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
    }
    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: 15px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h1 { margin-bottom: 0.5rem; color: #2c3e50; }
    p { color: #7f8c8d; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }
    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn-submit:disabled { background: #bdc3c7; cursor: not-allowed; }
    .error-msg { color: #e74c3c; margin-bottom: 1rem; font-size: 0.9rem; }
    .auth-footer { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; }
  `]
})
export class LoginComponent {
    authService = inject(AuthService);
    router = inject(Router);

    credentials = { username: '', password: '' };
    loading = false;
    error = '';

    onSubmit() {
        this.loading = true;
        this.error = '';
        this.authService.login(this.credentials).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err) => {
                this.error = err.error?.message || 'Invalid username or password';
                this.loading = false;
            }
        });
    }
}
