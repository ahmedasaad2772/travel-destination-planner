import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../../core/services/destination.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <header>
        <h1>Admin Dashboard</h1>
        <div class="actions">
          <button (click)="fetchNew()" class="btn-fetch">Fetch from API (Sync)</button>
          <button (click)="showAddForm = true" class="btn-add">Add Manually</button>
        </div>
      </header>

      <div *ngIf="message" [class.error]="isError" class="alert">{{ message }}</div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Capital</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let dest of destinations">
              <td>{{ dest.countryName }}</td>
              <td>{{ dest.capital }}</td>
              <td>{{ dest.region }}</td>
              <td><span class="badge" [class.approved]="dest.approved">{{ dest.approved ? 'Approved' : 'Pending' }}</span></td>
              <td>
                <button (click)="deleteDest(dest.id)" class="btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">Previous</button>
        <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button [disabled]="currentPage === totalPages - 1" (click)="changePage(currentPage + 1)">Next</button>
      </div>

      <div class="modal" *ngIf="showAddForm">
        <div class="modal-content">
          <h2>Add New Destination</h2>
          <form (ngSubmit)="onAddSubmit()">
            <div class="form-grid">
              <input name="country" [(ngModel)]="newDest.countryName" placeholder="Country Name" required>
              <input name="capital" [(ngModel)]="newDest.capital" placeholder="Capital" required>
              <input name="region" [(ngModel)]="newDest.region" placeholder="Region" required>
              <input name="subregion" [(ngModel)]="newDest.subregion" placeholder="Subregion">
              <input name="pop" [(ngModel)]="newDest.population" type="number" placeholder="Population">
              <input name="flag" [(ngModel)]="newDest.flagUrl" placeholder="Flag Image URL">
              <input name="map" [(ngModel)]="newDest.googleMapsUrl" placeholder="Google Maps URL">
            </div>
            <div class="modal-actions">
              <button type="button" (click)="showAddForm = false">Cancel</button>
              <button type="submit" class="btn-save">Save Destination</button>
            </div>
          </form>
        </div>
      </div>

      <div class="modal" *ngIf="showApiPreview">
        <div class="modal-content">
          <h2>New Countries from API</h2>
          <p>These countries are available in the REST API but not yet in your database.</p>
          <div class="api-country-list">
            <div *ngFor="let country of apiCountries" class="api-country-item">
              <div>
                <strong>{{ country.commonName }}</strong>
                <small style="display: block; color: #7f8c8d;">{{ country.region }} - {{ country.firstCapital }}</small>
              </div>
              <button (click)="addApiCountry(country)" class="btn-add-small">Add to System</button>
            </div>
            <div *ngIf="apiCountries.length === 0" style="padding: 2rem; text-align: center; color: #7f8c8d;">
              No new countries found to add.
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" (click)="showApiPreview = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .actions { display: flex; gap: 1rem; }
    .btn-fetch { background: #9b59b6; color: white; border: none; padding: 0.7rem 1.2rem; border-radius: 5px; cursor: pointer; }
    .btn-add { background: #2ecc71; color: white; border: none; padding: 0.7rem 1.2rem; border-radius: 5px; cursor: pointer; }
    .table-container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; background: #f8f9fa; padding: 1rem; color: #7f8c8d; }
    td { padding: 1rem; border-top: 1px solid #eee; }
    .badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; background: #eee; }
    .badge.approved { background: #d4edda; color: #155724; }
    .btn-delete { background: none; border: none; color: #e74c3c; cursor: pointer; font-weight: 600; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
    .modal-content { background: white; padding: 2rem; border-radius: 15px; width: 90%; max-width: 600px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
    .form-grid input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 5px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .btn-save { background: #3498db; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 5px; cursor: pointer; }
    .alert { padding: 1rem; margin-bottom: 1rem; border-radius: 5px; background: #d1ecf1; color: #0c5460; }
    .alert.error { background: #f8d7da; color: #721c24; }
    .api-country-list { max-height: 300px; overflow-y: auto; margin-top: 1rem; border: 1px solid #eee; border-radius: 5px; }
    .api-country-item { display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 1rem; border-bottom: 1px solid #eee; }
    .api-country-item:last-child { border-bottom: none; }
    .btn-add-small { background: #2ecc71; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; }
    .pagination {
      margin-top: 2rem;
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
export class AdminDashboardComponent implements OnInit {
  private destinationService = inject(DestinationService);
  destinations: any[] = [];
  apiCountries: any[] = [];
  showApiPreview = false;
  showAddForm = false;
  message = '';
  isError = false;
  currentPage = 0;
  totalPages = 0;

  newDest = {
    countryName: '',
    capital: '',
    region: '',
    subregion: '',
    population: 0,
    flagUrl: '',
    googleMapsUrl: '',
    approved: true
  };

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.destinationService.getAllDestinationsAdmin(this.currentPage).subscribe(res => {
      this.destinations = res.content;
      this.totalPages = res.totalPages;
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadAll();
  }

  fetchNew() {
    this.message = 'Fetching countries from API...';
    this.destinationService.fetchCountriesFromApi().subscribe({
      next: (countries) => {
        this.message = '';
        this.apiCountries = countries.filter(apiC =>
          !this.destinations.some(d => d.countryName.toLowerCase() === apiC.commonName.toLowerCase())
        );
        this.showApiPreview = true;
      },
      error: () => {
        this.message = 'Failed to sync with API.';
        this.isError = true;
      }
    });
  }

  addApiCountry(apiC: any) {
    const request = {
      countryName: apiC.commonName,
      capital: apiC.firstCapital,
      region: apiC.region,
      subregion: apiC.subregion,
      population: apiC.population,
      flagUrl: apiC.flagPng,
      googleMapsUrl: apiC.googleMaps,
      approved: true
    };

    this.destinationService.addDestination(request).subscribe({
      next: () => {
        this.apiCountries = this.apiCountries.filter(c => c.commonName !== apiC.commonName);
        this.loadAll();
      },
      error: (err) => {
        alert('Error adding country: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  onAddSubmit() {
    this.destinationService.addDestination(this.newDest).subscribe(() => {
      this.showAddForm = false;
      this.loadAll();
      this.newDest = { countryName: '', capital: '', region: '', subregion: '', population: 0, flagUrl: '', googleMapsUrl: '', approved: true };
    });
  }

  deleteDest(id: number) {
    if (confirm('Are you sure you want to delete this destination?')) {
      this.destinationService.removeDestination(id).subscribe(() => {
        this.loadAll();
      });
    }
  }
}
