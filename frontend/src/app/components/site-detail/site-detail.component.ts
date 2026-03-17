import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SiteService, SiteResponse } from '../../services/site.service';

@Component({
  selector: 'app-site-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-page">
      <a routerLink="/" class="back">← Retour au dashboard</a>

      <div *ngIf="site" class="detail-content">
        <h1>{{ site.name }}</h1>
        <p class="subtitle">Analysé le {{ site.createdAt | date: 'dd/MM/yyyy à HH:mm' }}</p>

        <!-- KPIs -->
        <div class="kpis">
          <div class="kpi-card highlight">
            <div class="label">CO₂ total</div>
            <div class="value">{{ site.totalCo2Kg / 1000 | number: '1.1-1' }} t CO₂e</div>
          </div>
          <div class="kpi-card">
            <div class="label">CO₂ / m²</div>
            <div class="value">{{ site.co2PerM2 | number: '1.1-1' }} kg</div>
          </div>
          <div class="kpi-card">
            <div class="label">CO₂ / employé</div>
            <div class="value">{{ site.co2PerEmployee | number: '1.0-0' }} kg</div>
          </div>
          <div class="kpi-card construction">
            <div class="label">Construction</div>
            <div class="value">{{ site.constructionCo2Kg / 1000 | number: '1.1-1' }} t</div>
          </div>
          <div class="kpi-card operation">
            <div class="label">Exploitation / an</div>
            <div class="value">{{ site.operationCo2KgPerYear / 1000 | number: '1.1-1' }} t</div>
          </div>
        </div>

        <!-- Infos site -->
        <div class="info-grid">
          <div class="info-block">
            <h3>Caractéristiques</h3>
            <table class="info-table">
              <tr>
                <td>Surface</td>
                <td>{{ site.surfaceM2 | number }} m²</td>
              </tr>
              <tr>
                <td>Parking</td>
                <td>{{ site.parkingSpots }} places</td>
              </tr>
              <tr>
                <td>Énergie</td>
                <td>{{ site.energyConsumptionMwh | number }} MWh/an</td>
              </tr>
              <tr>
                <td>Employés</td>
                <td>{{ site.employees }}</td>
              </tr>
              <tr>
                <td>Postes</td>
                <td>{{ site.workstations }}</td>
              </tr>
            </table>
          </div>
          <div class="info-block">
            <h3>Matériaux de construction</h3>
            <table class="info-table" *ngIf="site.materialBreakdown?.length">
              <thead>
                <tr>
                  <th>Matériau</th>
                  <th>Quantité</th>
                  <th>CO₂</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of site.materialBreakdown">
                  <td>{{ labelMaterial(m.materialType) }}</td>
                  <td>{{ m.quantityTons | number: '1.0-0' }} t</td>
                  <td>{{ m.co2Kg / 1000 | number: '1.1-1' }} t</td>
                  <td>
                    <span class="bar-wrap">
                      <span class="bar" [style.width.%]="m.percentageOfTotal"></span>
                    </span>
                    {{ m.percentageOfTotal | number: '1.0-0' }}%
                  </td>
                </tr>
              </tbody>
            </table>
            <p *ngIf="!site.materialBreakdown?.length" class="muted">Aucun matériau renseigné</p>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>
    </div>
  `,
  styles: [
    `
      .detail-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Inter', sans-serif;
      }
      .back {
        color: #6366f1;
        text-decoration: none;
        font-size: 0.875rem;
      }
      h1 {
        font-size: 1.6rem;
        font-weight: 700;
        margin: 1rem 0 0.25rem;
      }
      .subtitle {
        color: #94a3b8;
        font-size: 0.875rem;
        margin-bottom: 2rem;
      }
      .kpis {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .kpi-card {
        background: white;
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        text-align: center;
      }
      .kpi-card.highlight {
        background: #0f172a;
        color: white;
      }
      .kpi-card.construction .value {
        color: #d97706;
      }
      .kpi-card.operation .value {
        color: #2563eb;
      }
      .label {
        font-size: 0.7rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .kpi-card.highlight .label {
        color: #93c5fd;
      }
      .value {
        font-size: 1.2rem;
        font-weight: 700;
        color: #0f172a;
        margin-top: 4px;
      }
      .kpi-card.highlight .value {
        color: white;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .info-block {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .info-block h3 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #374151;
      }
      .info-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }
      .info-table th {
        font-size: 0.75rem;
        color: #64748b;
        padding: 6px 8px;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
      }
      .info-table td {
        padding: 8px;
        border-bottom: 1px solid #f8fafc;
      }
      .bar-wrap {
        display: inline-block;
        width: 60px;
        height: 6px;
        background: #f1f5f9;
        border-radius: 3px;
        vertical-align: middle;
        margin-right: 6px;
      }
      .bar {
        display: block;
        height: 100%;
        background: #6366f1;
        border-radius: 3px;
      }
      .muted {
        color: #94a3b8;
        font-size: 0.875rem;
      }
      .loading {
        text-align: center;
        padding: 3rem;
        color: #94a3b8;
      }
    `,
  ],
})
export class SiteDetailComponent implements OnInit {
  site: SiteResponse | null = null;
  loading = true;

  constructor(
  private route: ActivatedRoute,
  private siteService: SiteService,
  private cdr: ChangeDetectorRef
) {}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.siteService.getSiteById(id).subscribe({
    next: (data) => {
      this.site = data;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erreur API:', err);
      this.loading = false;
      this.cdr.detectChanges();
    },
  });
}

  labelMaterial(type: string): string {
    const labels: Record<string, string> = {
      CONCRETE: 'Béton',
      STEEL: 'Acier',
      GLASS: 'Verre',
      WOOD: 'Bois',
      ALUMINUM: 'Aluminium',
    };
    return labels[type] || type;
  }
}
