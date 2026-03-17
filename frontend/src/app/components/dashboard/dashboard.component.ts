import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteService, SiteResponse } from '../../services/site.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <div class="logo">
            <span class="logo-icon">🌱</span>
            <span class="logo-text">CarbonTrack</span>
          </div>
          <a routerLink="/site/new" class="btn-new">+ Nouveau site</a>
        </div>
      </header>

      <main class="main">
        <!-- KPIs globaux -->
        <section class="kpi-section">
          <div class="kpi-card total">
            <div class="kpi-icon">🏭</div>
            <div class="kpi-value">{{ globalTotal / 1000 | number: '1.0-0' }} t</div>
            <div class="kpi-label">CO₂ total (tous sites)</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">📐</div>
            <div class="kpi-value">{{ avgCo2PerM2 | number: '1.1-1' }} kg</div>
            <div class="kpi-label">Moyenne CO₂ / m²</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">👥</div>
            <div class="kpi-value">{{ avgCo2PerEmployee | number: '1.0-0' }} kg</div>
            <div class="kpi-label">Moyenne CO₂ / employé</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🏢</div>
            <div class="kpi-value">{{ sites.length }}</div>
            <div class="kpi-label">Sites analysés</div>
          </div>
        </section>

        <!-- Graphiques -->
        <section class="charts-section">
          <div class="chart-card">
            <h3>Construction vs Exploitation</h3>
            <canvas #donutChart></canvas>
          </div>
          <div class="chart-card">
            <h3>CO₂ par site (tonnes)</h3>
            <canvas #barChart></canvas>
          </div>
          <div class="chart-card wide">
            <h3>Répartition par matériau</h3>
            <canvas #materialChart></canvas>
          </div>
        </section>

        <!-- Liste des sites -->
        <section class="sites-section">
          <h2>Sites</h2>
          <div *ngIf="loading" class="loading">Chargement...</div>
          <table *ngIf="!loading && sites.length > 0" class="sites-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Surface</th>
                <th>Employés</th>
                <th>CO₂ total</th>
                <th>CO₂ / m²</th>
                <th>CO₂ / employé</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let site of sites" [routerLink]="['/site', site.id]" class="site-row">
                <td>
                  <strong>{{ site.name }}</strong>
                </td>
                <td>{{ site.surfaceM2 | number }} m²</td>
                <td>{{ site.employees }}</td>
                <td>{{ site.totalCo2Kg / 1000 | number: '1.1-1' }} t</td>
                <td>{{ site.co2PerM2 | number: '1.1-1' }} kg</td>
                <td>{{ site.co2PerEmployee | number: '1.0-0' }} kg</td>
                <td>
                  <span class="badge" [class]="getScoreClass(site.co2PerM2)">
                    {{ getScore(site.co2PerM2) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!loading && sites.length === 0" class="empty">
            Aucun site enregistré.
            <a routerLink="/site/new">Créer le premier site →</a>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      .dashboard {
        min-height: 100vh;
        background: #f8fafc;
        font-family: 'Inter', sans-serif;
      }

      /* Header */
      .header {
        background: #0f172a;
        color: white;
        padding: 0 2rem;
      }
      .header-inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.1rem;
        font-weight: 700;
      }
      .logo-icon {
        font-size: 1.3rem;
      }
      .btn-new {
        background: #22c55e;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 600;
      }

      /* Main */
      .main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      /* KPIs */
      .kpi-section {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .kpi-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        text-align: center;
      }
      .kpi-card.total {
        background: linear-gradient(135deg, #0f172a, #1e40af);
        color: white;
      }
      .kpi-icon {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      .kpi-value {
        font-size: 1.75rem;
        font-weight: 700;
      }
      .kpi-card:not(.total) .kpi-value {
        color: #0f172a;
      }
      .kpi-label {
        font-size: 0.75rem;
        margin-top: 4px;
        opacity: 0.7;
      }

      /* Charts */
      .charts-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .chart-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .chart-card.wide {
        grid-column: 1 / -1;
      }
      .chart-card h3 {
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1rem;
      }
      canvas {
        max-height: 260px;
      }

      /* Table */
      .sites-section h2 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #0f172a;
      }
      .sites-table {
        width: 100%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        border-collapse: collapse;
        overflow: hidden;
      }
      .sites-table th {
        padding: 12px 16px;
        background: #f1f5f9;
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
        text-align: left;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .sites-table td {
        padding: 14px 16px;
        border-top: 1px solid #f1f5f9;
        font-size: 0.875rem;
      }
      .site-row {
        cursor: pointer;
        transition: background 0.15s;
      }
      .site-row:hover {
        background: #f8fafc;
      }
      .badge {
        padding: 3px 10px;
        border-radius: 99px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .badge.green {
        background: #dcfce7;
        color: #15803d;
      }
      .badge.yellow {
        background: #fef9c3;
        color: #854d0e;
      }
      .badge.red {
        background: #fee2e2;
        color: #991b1b;
      }
      .loading {
        text-align: center;
        padding: 2rem;
        color: #94a3b8;
      }
      .empty {
        text-align: center;
        padding: 3rem;
        color: #94a3b8;
      }
      .empty a {
        color: #2563eb;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('donutChart') donutChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('materialChart') materialChartRef!: ElementRef;

  sites: SiteResponse[] = [];
  loading = true;

  get globalTotal() {
    return this.sites.reduce((s, x) => s + x.totalCo2Kg, 0);
  }
  get avgCo2PerM2() {
    return this.sites.length
      ? this.sites.reduce((s, x) => s + x.co2PerM2, 0) / this.sites.length
      : 0;
  }
  get avgCo2PerEmployee() {
    return this.sites.length
      ? this.sites.reduce((s, x) => s + x.co2PerEmployee, 0) / this.sites.length
      : 0;
  }

  constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {}

ngOnInit(): void {
  this.siteService.getAllSites().subscribe({
    next: (data) => {
      this.sites = data;
      this.loading = false;
      this.cdr.detectChanges();
      setTimeout(() => this.initCharts(), 100);
    },
    error: () => { this.loading = false; }
  });
}

ngAfterViewInit(): void {
}

  private initCharts(): void {
    if (!this.sites.length) return;

    const totalConstruction = this.sites.reduce((s, x) => s + x.constructionCo2Kg, 0);
    const totalOperation = this.sites.reduce((s, x) => s + x.operationCo2KgPerYear, 0);

    // Donut : construction vs exploitation
    new Chart(this.donutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Construction', 'Exploitation annuelle'],
        datasets: [
          {
            data: [totalConstruction / 1000, totalOperation / 1000],
            backgroundColor: ['#f59e0b', '#3b82f6'],
            borderWidth: 0,
          },
        ],
      },
      options: { plugins: { legend: { position: 'bottom' } } },
    });

    // Bar : CO₂ par site
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.sites.map((s) => s.name),
        datasets: [
          {
            label: 'CO₂ total (t)',
            data: this.sites.map((s) => s.totalCo2Kg / 1000),
            backgroundColor: '#6366f1',
            borderRadius: 6,
          },
        ],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });

    // Bar horizontal : répartition matériaux (agrégat tous sites)
    const materialTotals: Record<string, number> = {};
    this.sites.forEach((site) => {
      site.materialBreakdown?.forEach((m) => {
        materialTotals[m.materialType] = (materialTotals[m.materialType] || 0) + m.co2Kg;
      });
    });

    new Chart(this.materialChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(materialTotals),
        datasets: [
          {
            label: 'CO₂ (kg)',
            data: Object.values(materialTotals),
            backgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } },
      },
    });
  }

  getScore(co2PerM2: number): string {
    if (co2PerM2 < 50) return 'A';
    if (co2PerM2 < 150) return 'B';
    return 'C';
  }

  getScoreClass(co2PerM2: number): string {
    if (co2PerM2 < 50) return 'green';
    if (co2PerM2 < 150) return 'yellow';
    return 'red';
  }
}
