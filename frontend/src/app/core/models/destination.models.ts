export interface Destination {
    id: number;
    countryName: string;
    capital: string;
    region: string;
    subregion: string;
    population: number;
    flagUrl: string;
    googleMapsUrl: string;
    wantToVisit?: boolean;
}

export interface DestinationDto {
    id: number;
    countryName: string;
    capital: string;
    region: string;
    subregion: string;
    population: number;
    flagUrl: string;
    googleMapsUrl: string;
    wantToVisit: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
