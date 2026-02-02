import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../../core/services/destination.service';
import { DestinationDto } from '../../../core/models/destination.models';
import { DestinationCardComponent } from '../../../shared/components/destination-card/destination-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-want-to-visit',
  standalone: true,
  imports: [CommonModule, DestinationCardComponent, RouterLink],
  template: `
    <div class="container">
      <header>
        <h1>My Travel Bucket List</h1>
        <p>Destinations you're dreaming of visiting.</p>
      </header>

      <div *ngIf="loading" class="loader">Loading your list...</div>

      <div class="destinations-grid" *ngIf="!loading && destinations.length > 0">
        <app-destination-card 
          *ngFor="let dest of destinations" 
          [destination]="dest"
          [showRemoveOption]="true"
          (toggleVisit)="onRemove($event)">
        </app-destination-card>
      </div>

      <div *ngIf="!loading && destinations.length === 0" class="empty-state">
        <div class="icon">✈️</div>
        <h3>Your list is empty</h3>
        <p>Start exploring and add some destinations to your bucket list!</p>
        <a routerLink="/dashboard" class="btn-explore">Explore Destinations</a>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    header { margin-bottom: 3rem; text-align: center; }
    h1 { color: #2c3e50; }
    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    .loader { text-align: center; padding: 4rem; }
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      background: #f9f9f9;
      border-radius: 20px;
    }
    .empty-state .icon { font-size: 4rem; margin-bottom: 1rem; }
    .btn-explore {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.8rem 2rem;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 30px;
      font-weight: 600;
    }
  `]
})
export class WantToVisitComponent implements OnInit {
  private destinationService = inject(DestinationService);
  destinations: DestinationDto[] = [];
  loading = true;

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.destinationService.getWantToVisitList().subscribe({
      next: (res) => {
        this.destinations = res.content;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onRemove(dest: DestinationDto) {
    this.destinationService.removeFromWantToVisit(dest.id).subscribe(() => {
      this.destinations = this.destinations.filter(d => d.id !== dest.id);
    });
  }
}
