import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MaterialInput {
  materialType: 'CONCRETE' | 'STEEL' | 'GLASS' | 'WOOD' | 'ALUMINUM';
  quantityTons: number;
}

export interface SiteRequest {
  name: string;
  surfaceM2: number;
  parkingSpots: number;
  energyConsumptionMwh: number;
  employees: number;
  workstations: number;
  materials: MaterialInput[];
}

export interface MaterialBreakdown {
  materialType: string;
  quantityTons: number;
  co2Kg: number;
  percentageOfTotal: number;
}

export interface SiteResponse {
  id: number;
  name: string;
  surfaceM2: number;
  parkingSpots: number;
  energyConsumptionMwh: number;
  employees: number;
  workstations: number;
  createdAt: string;
  constructionCo2Kg: number;
  operationCo2KgPerYear: number;
  totalCo2Kg: number;
  co2PerM2: number;
  co2PerEmployee: number;
  materialBreakdown: MaterialBreakdown[];
}

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly apiUrl = 'http://localhost:8080/api/sites';

  constructor(private http: HttpClient) {}

  createSite(payload: SiteRequest): Observable<SiteResponse> {
    return this.http.post<SiteResponse>(this.apiUrl, payload);
  }

  getAllSites(): Observable<SiteResponse[]> {
    return this.http.get<SiteResponse[]>(this.apiUrl);
  }

  getSiteById(id: number): Observable<SiteResponse> {
    return this.http.get<SiteResponse>(`${this.apiUrl}/${id}`);
  }
}
