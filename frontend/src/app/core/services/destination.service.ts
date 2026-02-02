import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DestinationDto, PaginatedResponse } from '../models/destination.models';

@Injectable({
    providedIn: 'root'
})
export class DestinationService {
    private apiUrl = 'http://localhost:8080/api/destinations';
    private adminUrl = 'http://localhost:8080/api/admin';
    private userUrl = 'http://localhost:8080/api/user';

    constructor(private http: HttpClient) { }

    getDestinations(page: number = 0, size: number = 9): Observable<PaginatedResponse<DestinationDto>> {
        const params = new HttpParams().set('page', page).set('size', size);
        return this.http.get<PaginatedResponse<DestinationDto>>(this.apiUrl, { params });
    }

    searchDestinations(query: string, page: number = 0, size: number = 9): Observable<PaginatedResponse<DestinationDto>> {
        const params = new HttpParams().set('q', query).set('page', page).set('size', size);
        return this.http.get<PaginatedResponse<DestinationDto>>(`${this.apiUrl}/search`, { params });
    }

    addToWantToVisit(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/want-to-visit`, {});
    }

    removeFromWantToVisit(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}/want-to-visit`);
    }

    getWantToVisitList(page: number = 0, size: number = 9): Observable<PaginatedResponse<DestinationDto>> {
        const params = new HttpParams().set('page', page).set('size', size);
        return this.http.get<PaginatedResponse<DestinationDto>>(`${this.userUrl}/want-to-visit`, { params });
    }

     
    getAllDestinationsAdmin(page: number = 0, size: number = 9): Observable<PaginatedResponse<any>> {
        const params = new HttpParams().set('page', page).set('size', size);
        return this.http.get<PaginatedResponse<any>>(`${this.adminUrl}/destinations`, { params });
    }

    addDestination(destination: any): Observable<any> {
        return this.http.post(`${this.adminUrl}/destinations`, destination);
    }

    removeDestination(id: number): Observable<any> {
        return this.http.delete(`${this.adminUrl}/destinations/${id}`);
    }

    fetchCountriesFromApi(): Observable<any[]> {
        return this.http.get<any[]>(`${this.adminUrl}/countries/fetch`);
    }
}
