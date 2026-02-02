import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar">
      <div class="nav-brand">
        <a routerLink="/">🌍 TravelPlanner</a>
      </div>
      <ul class="nav-links">
        <li *ngIf="authService.isLoggedIn()">
          <a routerLink="/dashboard" routerLinkActive="active">Destinations</a>
        </li>
        <li *ngIf="authService.isLoggedIn()">
          <a routerLink="/want-to-visit" routerLinkActive="active">My List</a>
        </li>
        <li *ngIf="authService.isAdmin()">
          <a routerLink="/admin" routerLinkActive="active" class="admin-link">Admin</a>
        </li>
      </ul>
      <div class="nav-auth">
        <ng-container *ngIf="authService.currentUser() as user; else guest">
          <span class="username">{{ user.username }}</span>
          <button (click)="authService.logout()" class="btn-logout">Logout</button>
        </ng-container>
        <ng-template #guest>
          <a routerLink="/login" class="btn-login">Login</a>
          <a routerLink="/register" class="btn-register">Register</a>
        </ng-template>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-brand a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      text-decoration: none;
      color: #34495e;
      font-weight: 500;
      transition: color 0.3s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #3498db;
    }
    .admin-link {
      color: #e67e22 !important;
    }
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .username {
      font-weight: 600;
      color: #2c3e50;
    }
    .btn-login, .btn-register, .btn-logout {
      padding: 0.5rem 1rem;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
    }
    .btn-login {
      color: #3498db;
    }
    .btn-register {
      background: #3498db;
      color: white;
    }
    .btn-register:hover {
      background: #2980b9;
    }
    .btn-logout {
      background: #e74c3c;
      color: white;
    }
    .btn-logout:hover {
      background: #c0392b;
    }
  `]
})
export class NavbarComponent {
    authService = inject(AuthService);
}
