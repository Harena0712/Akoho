import { Component, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-inserer-oeufs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inserer-oeufs.html',
  styleUrl: './inserer-oeufs.css'
})
export class InsererOeufsComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  lots: any[] = [];
  idLot: number | null = null;
  nombreOeufs: number | null = null;
  date = '';
  capaciteLot: any | null = null;
  message = '';
  error = '';

  constructor() {
    afterNextRender(() => {
      this.api.getLots().subscribe({
        next: (data) => {
          this.lots = data;
          this.cdr.detectChanges();
        },
        error: () => this.error = 'Impossible de charger les lots'
      });
    });
  }

  onSubmit() {
    if (!this.idLot || !this.nombreOeufs || !this.date) return;
    this.message = '';
    this.error = '';

    if (this.capaciteLot && this.nombreOeufs > this.capaciteLot.oeufsRestants) {
      this.error = `Le nombre d'oeufs dépasse le reste disponible (${this.capaciteLot.oeufsRestants})`;
      return;
    }

    this.api.createLotAtody({ idLot: this.idLot, nbAtody: this.nombreOeufs, date: this.date }).subscribe({
      next: () => {
        this.message = 'Oeufs enregistrés avec succès !';
        this.idLot = null;
        this.nombreOeufs = null;
        this.date = '';
        this.capaciteLot = null;
      },
      error: (err) => this.error = err.error?.error || 'Erreur lors de l\'enregistrement'
    });
  }

  onLotOrDateChange() {
    if (!this.idLot || !this.date) {
      this.capaciteLot = null;
      return;
    }
    this.api.getCapaciteOeufsParLotEtDate(this.idLot, this.date).subscribe({
      next: (data) => {
        this.capaciteLot = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.capaciteLot = null;
        this.error = 'Impossible de calculer le reste d\'oeufs pour ce lot';
      }
    });
  }
}
