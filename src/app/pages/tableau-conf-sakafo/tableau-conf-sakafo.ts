import { ChangeDetectorRef, Component, afterNextRender, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface ConfSakafoRow {
  id: number;
  idRace: number;
  race: string;
  age: number;
  variationPoid: number;
  sakafoG: number;
  cumulPoid: number;
  cumulSakafoG: number;
}

@Component({
  selector: 'app-tableau-conf-sakafo',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './tableau-conf-sakafo.html',
  styleUrl: './tableau-conf-sakafo.css'
})
export class TableauConfSakafoComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  rows: ConfSakafoRow[] = [];
  error = '';
  races: any[] = [];
  selectedRaceId: number | null = null;
  dateDebut = '';
  dateFin = '';
  loading = false;
  poidsError = '';
  result: any | null = null;

  constructor() {
    afterNextRender(() => this.loadData());
  }

  get selectedRaceName() {
    return this.races.find(race => race.id === this.selectedRaceId)?.libelle || '';
  }

  calculerPoids() {
    if (!this.selectedRaceId || !this.dateDebut || !this.dateFin) {
      this.poidsError = 'Veuillez renseigner la race, la date debut et la date fin';
      this.result = null;
      return;
    }

    this.loading = true;
    this.poidsError = '';
    this.result = null;

    this.api.getPoidsAkoho(this.selectedRaceId, this.dateDebut, this.dateFin).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.poidsError = err.error?.error || 'Erreur lors du calcul du poids';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadData() {
    this.error = '';

    this.api.getRaces().subscribe({
      next: (races) => {
        this.races = races;
        this.cdr.detectChanges();

        const raceMap = new Map<number, string>(
          races.map((race) => [Number(race.id), race.libelle])
        );

        this.api.getConfSakafo().subscribe({
          next: (items) => {
            const groupedByRace = new Map<number, any[]>();

            for (const item of items) {
              const raceId = Number(item.idRace);
              if (!groupedByRace.has(raceId)) {
                groupedByRace.set(raceId, []);
              }
              groupedByRace.get(raceId)?.push(item);
            }

            const result: ConfSakafoRow[] = [];
            const raceIds = Array.from(groupedByRace.keys()).sort((a, b) => a - b);

            for (const raceId of raceIds) {
              const raceItems = (groupedByRace.get(raceId) || [])
                .slice()
                .sort((a, b) => Number(a.age) - Number(b.age));

              let cumulPoid = 0;
              let cumulSakafoG = 0;

              for (const item of raceItems) {
                const variationPoid = Number(item.variationPoid) || 0;
                const sakafoG = Number(item.sakafoG) || 0;

                cumulPoid += variationPoid;
                cumulSakafoG += sakafoG;

                result.push({
                  id: Number(item.id),
                  idRace: raceId,
                  race: raceMap.get(raceId) || `Race ${raceId}`,
                  age: Number(item.age),
                  variationPoid,
                  sakafoG,
                  cumulPoid,
                  cumulSakafoG
                });
              }
            }

            this.rows = result;
          },
          error: () => {
            this.error = 'Impossible de charger la configuration sakafo';
          }
        });
      },
      error: () => {
        this.error = 'Impossible de charger les races';
      }
    });
  }
}
