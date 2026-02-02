import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Create Account</h1>
        <p>Join us and start planning your trips</p>
        
        <form (ngSubmit)="onSubmit()" #regForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" [(ngModel)]="user.username" required minlength="3">
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" [(ngModel)]="user.email" required email>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" [(ngModel)]="user.password" required minlength="6">
          </div>
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" [disabled]="!regForm.form.valid || loading" class="btn-submit">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>
        
        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Login here</a>
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
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn-submit:hover { background: #27ae60; }
    .btn-submit:disabled { background: #bdc3c7; cursor: not-allowed; }
    .error-msg { color: #e74c3c; margin-bottom: 1rem; font-size: 0.9rem; }
    .auth-footer { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; }
  `]
})
export class RegisterComponent {
    authService = inject(AuthService);
    router = inject(Router);

    user = { username: '', email: '', password: '' };
    loading = false;
    error = '';

    onSubmit() {
        this.loading = true;
        this.error = '';
        this.authService.register(this.user).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err) => {
                this.error = err.error?.message || 'Registration failed. Try a different username.';
                this.loading = false;
            }
        });
    }
}
