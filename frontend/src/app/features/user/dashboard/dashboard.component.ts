import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../../core/services/destination.service';
import { DestinationDto, PaginatedResponse } from '../../../core/models/destination.models';
import { DestinationCardComponent } from '../../../shared/components/destination-card/destination-card.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DestinationCardComponent, FormsModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Discover New Worlds</h1>
        <p>Explore countries, capitals, and regions to find your next destination.</p>
        
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search by country, capital or region...">
        </div>
      </header>

      <div *ngIf="loading" class="loader">Loading destinations...</div>

      <div class="destinations-grid" *ngIf="!loading">
        <app-destination-card 
          *ngFor="let dest of destinations" 
          [destination]="dest"
          (toggleVisit)="onToggleVisit($event)">
        </app-destination-card>
      </div>

      <div *ngIf="!loading && destinations.length === 0" class="no-results">
        <p>No destinations found. Try a different search.</p>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">Previous</button>
        <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button [disabled]="currentPage === totalPages - 1" (click)="changePage(currentPage + 1)">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .dashboard-header { text-align: center; margin-bottom: 3rem; }
    h1 { font-size: 2.5rem; color: #2c3e50; margin-bottom: 0.5rem; }
    p { color: #7f8c8d; font-size: 1.1rem; }
    .search-box {
      margin-top: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    .search-box input {
      width: 100%;
      padding: 1rem 1.5rem;
      border: 2px solid #eee;
      border-radius: 30px;
      font-size: 1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      transition: border-color 0.3s;
    }
    .search-box input:focus { outline: none; border-color: #3498db; }
    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    .loader, .no-results { text-align: center; padding: 4rem; color: #7f8c8d; }
    .pagination {
      margin-top: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
    }
    .pagination button {
      padding: 0.6rem 1.2rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 5px;
      cursor: pointer;
    }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class DashboardComponent implements OnInit {
  private destinationService = inject(DestinationService);

  destinations: DestinationDto[] = [];
  loading = true;
  searchQuery = '';
  currentPage = 0;
  totalPages = 0;
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.loadDestinations();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.currentPage = 0;
      this.loadDestinations(query);
    });
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  loadDestinations(query: string = this.searchQuery) {
    this.loading = true;
    const obs = query
      ? this.destinationService.searchDestinations(query, this.currentPage)
      : this.destinationService.getDestinations(this.currentPage);

    obs.subscribe({
      next: (res) => {
        this.destinations = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onToggleVisit(dest: DestinationDto) {
    if (dest.wantToVisit) {
      this.destinationService.removeFromWantToVisit(dest.id).subscribe(() => {
        dest.wantToVisit = false;
      });
    } else {
      this.destinationService.addToWantToVisit(dest.id).subscribe(() => {
        dest.wantToVisit = true;
      });
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadDestinations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
