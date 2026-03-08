import { Component, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-inserer-lot',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inserer-lot.html',
  styleUrl: './inserer-lot.css'
})
export class InsererLotComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  races: any[] = [];
  idRace: number | null = null;
  nombre: number | null = null;
  age: number | null = null;
  date = '';
  message = '';
  error = '';

  constructor() {
    afterNextRender(() => {
      this.api.getRaces().subscribe({
        next: (data) => {
          this.races = data;
          this.cdr.detectChanges();
        },
        error: () => this.error = 'Impossible de charger les races'
      });
    });
  }

  onSubmit() {
    if (!this.idRace || !this.nombre || this.age == null || !this.date) return;
    this.message = '';
    this.error = '';
    this.api.createLot({ idRace: this.idRace, nb: this.nombre, age: this.age, date: this.date }).subscribe({
      next: () => {
        this.message = 'Lot enregistré avec succès !';
        this.idRace = null;
        this.nombre = null;
        this.age = null;
        this.date = '';
      },
      error: (err) => this.error = err.error?.error || 'Erreur lors de l\'enregistrement'
    });
  }
}
