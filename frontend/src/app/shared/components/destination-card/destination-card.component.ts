import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationDto } from '../../../core/models/destination.models';

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-image" [style.backgroundImage]="'url(' + destination.flagUrl + ')'">
        <div class="overlay">
          <a [href]="destination.googleMapsUrl" target="_blank" class="btn-map">📍 View</a>
          <button 
            *ngIf="showRemoveOption && destination.wantToVisit" 
            (click)="$event.stopPropagation(); toggleVisit.emit(destination)" 
            class="btn-hover-delete">
            🗑️ Remove
          </button>
        </div>
      </div>
      <div class="card-content">
        <h3>{{ destination.countryName }}</h3>
        <p class="capital">Capital: {{ destination.capital }}</p>
        <div class="stats">
          <span>👥 {{ destination.population | number }}</span>
          <span>🌍 {{ destination.region }}</span>
        </div>
        <button 
          *ngIf="!showRemoveOption"
          (click)="toggleVisit.emit(destination)"
          [class.btn-remove]="destination.wantToVisit"
          [class.btn-add]="!destination.wantToVisit"
          class="btn-action">
          {{ destination.wantToVisit ? 'Remove from List' : 'Want to Visit' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      transition: transform 0.3s;
    }
    .card:hover { transform: translateY(-5px); }
    .card-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .card-image:hover .overlay { opacity: 1; }
    .btn-map, .btn-hover-delete {
      background: white;
      color: #2c3e50;
      padding: 0.6rem 1.2rem;
      border-radius: 25px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 120px;
      justify-content: center;
    }
    .btn-hover-delete {
      background: #e74c3c;
      color: white;
    }
    .btn-hover-delete:hover {
      background: #c0392b;
    }
    .card-content { padding: 1.2rem; }
    h3 { margin: 0 0 0.5rem; color: #2c3e50; }
    .capital { color: #7f8c8d; font-size: 0.9rem; margin-bottom: 1rem; }
    .stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #7f8c8d;
      margin-bottom: 1.2rem;
    }
    .btn-action {
      width: 100%;
      padding: 0.8rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-add { background: #3498db; color: white; }
    .btn-add:hover { background: #2980b9; }
    .btn-remove { background: #fdf0f0; color: #e74c3c; border: 1px solid #fab1a0; }
    .btn-remove:hover { background: #fab1a0; }
  `]
})
export class DestinationCardComponent {
  @Input({ required: true }) destination!: DestinationDto;
  @Input() showRemoveOption = false;
  @Output() toggleVisit = new EventEmitter<DestinationDto>();
}
