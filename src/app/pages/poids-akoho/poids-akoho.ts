import { ChangeDetectorRef, Component, afterNextRender, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-poids-akoho',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './poids-akoho.html',
  styleUrl: './poids-akoho.css'
})
export class PoidsAkohoComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  races: any[] = [];
  selectedRaceId: number | null = null;
  dateDebut = '';
  dateFin = '';
  loading = false;
  error = '';
  result: any | null = null;

  constructor() {
    afterNextRender(() => this.loadRaces());
  }

  get selectedRaceName() {
    return this.races.find(race => race.id === this.selectedRaceId)?.libelle || '';
  }

  loadRaces() {
    this.api.getRaces().subscribe({
      next: (data) => {
        this.races = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Impossible de charger les races';
      }
    });
  }

  calculerPoids() {
    if (!this.selectedRaceId || !this.dateDebut || !this.dateFin) {
      this.error = 'Veuillez renseigner la race, la date debut et la date fin';
      this.result = null;
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = null;

    this.api.getPoidsAkoho(this.selectedRaceId, this.dateDebut, this.dateFin).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors du calcul du poids';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}