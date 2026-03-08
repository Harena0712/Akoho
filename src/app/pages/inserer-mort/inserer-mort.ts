import { Component, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-inserer-mort',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inserer-mort.html',
  styleUrl: './inserer-mort.css'
})
export class InsererMortComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  lots: any[] = [];
  idLot: number | null = null;
  nombreMort: number | null = null;
  date = '';
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
    if (!this.idLot || !this.nombreMort || !this.date) return;
    this.message = '';
    this.error = '';
    this.api.createLotMaty({ idLot: this.idLot, nbMaty: this.nombreMort, date: this.date }).subscribe({
      next: () => {
        this.message = 'Mortalité enregistrée avec succès !';
        this.idLot = null;
        this.nombreMort = null;
        this.date = '';
      },
      error: (err) => this.error = err.error?.error || 'Erreur lors de l\'enregistrement'
    });
  }
}
