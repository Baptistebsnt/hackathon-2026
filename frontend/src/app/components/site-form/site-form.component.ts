import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SiteService, SiteResponse } from '../../services/site.service';

@Component({
  selector: 'app-site-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Nouveau site</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <div class="field">
          <label>Nom du site</label>
          <input formControlName="name" placeholder="Ex: Campus Rennes Capgemini" />
        </div>

        <div class="row">
          <div class="field">
            <label>Surface (m²)</label>
            <input type="number" formControlName="surfaceM2" placeholder="11771" />
          </div>
          <div class="field">
            <label>Places de parking</label>
            <input type="number" formControlName="parkingSpots" placeholder="308" />
          </div>
        </div>

        <div class="row">
          <div class="field">
            <label>Consommation énergie (MWh/an)</label>
            <input type="number" formControlName="energyConsumptionMwh" placeholder="1840" />
          </div>
          <div class="field">
            <label>Nombre d'employés</label>
            <input type="number" formControlName="employees" placeholder="1800" />
          </div>
        </div>

        <div class="field">
          <label>Postes de travail</label>
          <input type="number" formControlName="workstations" placeholder="1037" />
        </div>

        <!-- Matériaux de construction -->
        <div class="section">
          <h3>Matériaux de construction</h3>
          <div formArrayName="materials">
            <div *ngFor="let mat of materials.controls; let i = index"
                 [formGroupName]="i" class="material-row">
              <select formControlName="materialType">
                <option value="CONCRETE">Béton</option>
                <option value="STEEL">Acier</option>
                <option value="GLASS">Verre</option>
                <option value="WOOD">Bois</option>
                <option value="ALUMINUM">Aluminium</option>
              </select>
              <input type="number" formControlName="quantityTons" placeholder="Quantité (tonnes)" />
              <button type="button" class="btn-remove" (click)="removeMaterial(i)">✕</button>
            </div>
          </div>
          <button type="button" class="btn-add" (click)="addMaterial()">+ Ajouter matériau</button>
        </div>

        <button type="submit" class="btn-submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Calcul en cours...' : 'Calculer l\'empreinte carbone' }}
        </button>
      </form>

      <!-- Résultats -->
      <div *ngIf="result" class="results">
        <h2>Résultats — {{ result.name }}</h2>
        <div class="kpis">
          <div class="kpi">
            <span class="kpi-value">{{ (result.totalCo2Kg / 1000) | number:'1.1-1' }} t</span>
            <span class="kpi-label">CO₂ total</span>
          </div>
          <div class="kpi">
            <span class="kpi-value">{{ result.co2PerM2 | number:'1.1-1' }} kg</span>
            <span class="kpi-label">CO₂ / m²</span>
          </div>
          <div class="kpi">
            <span class="kpi-value">{{ result.co2PerEmployee | number:'1.1-1' }} kg</span>
            <span class="kpi-label">CO₂ / employé</span>
          </div>
          <div class="kpi construction">
            <span class="kpi-value">{{ (result.constructionCo2Kg / 1000) | number:'1.1-1' }} t</span>
            <span class="kpi-label">Construction</span>
          </div>
          <div class="kpi operation">
            <span class="kpi-value">{{ (result.operationCo2KgPerYear / 1000) | number:'1.1-1' }} t/an</span>
            <span class="kpi-label">Exploitation</span>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .form-container { max-width: 720px; margin: 2rem auto; padding: 2rem; font-family: sans-serif; }
    h2 { font-size: 1.4rem; font-weight: 600; margin-bottom: 1.5rem; color: #1a1a2e; }
    h3 { font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
    .field { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .field label { font-size: 0.8rem; font-weight: 500; color: #555; }
    input, select { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.95rem; }
    .row { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .field { margin-bottom: 1rem; }
    .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .material-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .material-row select { flex: 1.5; }
    .material-row input { flex: 1; }
    .btn-remove { background: #fee2e2; color: #dc2626; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; }
    .btn-add { background: none; color: #2563eb; border: 1px dashed #2563eb; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-size: 0.875rem; margin-top: 0.5rem; }
    .btn-submit { width: 100%; padding: 12px; background: #1a1a2e; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 1rem; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .results { margin-top: 2rem; padding: 1.5rem; background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; }
    .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem; }
    .kpi { background: white; border-radius: 8px; padding: 1rem; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .kpi-value { display: block; font-size: 1.5rem; font-weight: 700; color: #15803d; }
    .kpi-label { display: block; font-size: 0.75rem; color: #6b7280; margin-top: 4px; }
    .kpi.construction .kpi-value { color: #d97706; }
    .kpi.operation .kpi-value { color: #2563eb; }
    .error { color: #dc2626; margin-top: 1rem; padding: 0.75rem; background: #fee2e2; border-radius: 6px; }
  `]
})
export class SiteFormComponent {
  form: FormGroup;
  result: SiteResponse | null = null;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private siteService: SiteService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surfaceM2: [null, [Validators.required, Validators.min(1)]],
      parkingSpots: [0],
      energyConsumptionMwh: [null, [Validators.required, Validators.min(0)]],
      employees: [null, Validators.min(1)],
      workstations: [null],
      materials: this.fb.array([])
    });
  }

  get materials(): FormArray {
    return this.form.get('materials') as FormArray;
  }

  addMaterial(): void {
    this.materials.push(this.fb.group({
      materialType: ['CONCRETE', Validators.required],
      quantityTons: [null, [Validators.required, Validators.min(0.1)]]
    }));
  }

  removeMaterial(index: number): void {
    this.materials.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.siteService.createSite(this.form.value).subscribe({
      next: (res) => { this.result = res; this.loading = false; },
      error: (err) => { this.error = 'Erreur lors du calcul. Vérifiez que le backend est démarré.'; this.loading = false; }
    });
  }
}
