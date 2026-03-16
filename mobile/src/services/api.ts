// Remplacer par l'IP locale de votre machine en dev (pas localhost sur émulateur Android)
const API_BASE = 'http://10.0.2.2:8080/api'; // Android emulator
// const API_BASE = 'http://localhost:8080/api'; // iOS simulator

export type MaterialType = 'CONCRETE' | 'STEEL' | 'GLASS' | 'WOOD' | 'ALUMINUM';

export interface MaterialInput {
  materialType: MaterialType;
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
  materialBreakdown: {
    materialType: string;
    quantityTons: number;
    co2Kg: number;
    percentageOfTotal: number;
  }[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const getSites = () => request<SiteResponse[]>('/sites');
export const getSiteById = (id: number) => request<SiteResponse>(`/sites/${id}`);
export const createSite = (data: SiteRequest) =>
  request<SiteResponse>('/sites', { method: 'POST', body: JSON.stringify(data) });
