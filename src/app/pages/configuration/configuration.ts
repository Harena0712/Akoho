import { afterNextRender, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css'
})
export class ConfigurationComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  races: any[] = [];

  raceLibelle = '';
  racePuGg: number | null = null;
  racePvGg: number | null = null;
  racePrixAtody: number | null = null;
  raceMessage = '';
  raceError = '';

  confIdRace: number | null = null;
  confAge: number | null = null;
  confVariationPoid: number | null = null;
  confSakafoG: number | null = null;
  confMessage = '';
  confError = '';

  constructor() {
    afterNextRender(() => this.loadRaces());
  }

  loadRaces() {
    this.api.getRaces().subscribe({
      next: (data) => {
        this.races = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.raceError = 'Impossible de charger les races';
        this.confError = 'Impossible de charger les races';
      }
    });
  }

  onRaceSubmit() {
    if (!this.raceLibelle || this.racePuGg == null || this.racePvGg == null || this.racePrixAtody == null) {
      return;
    }

    this.raceMessage = '';
    this.raceError = '';

    this.api.createRace({
      libelle: this.raceLibelle,
      puGg: this.racePuGg,
      pvGg: this.racePvGg,
      prixAtody: this.racePrixAtody
    }).subscribe({
      next: (race) => {
        this.raceMessage = 'Race enregistrée avec succès !';
        this.raceLibelle = '';
        this.racePuGg = null;
        this.racePvGg = null;
        this.racePrixAtody = null;
        this.races = [...this.races, race];
        if (this.confIdRace == null) {
          this.confIdRace = race.id;
        }
      },
      error: (err) => {
        this.raceError = err.error?.error || 'Erreur lors de l\'enregistrement de la race';
      }
    });
  }

  onConfSubmit() {
    if (!this.confIdRace || this.confAge == null || this.confVariationPoid == null || this.confSakafoG == null) {
      return;
    }

    this.confMessage = '';
    this.confError = '';

    this.api.createConfSakafo({
      idRace: this.confIdRace,
      age: this.confAge,
      variationPoid: this.confVariationPoid,
      sakafoG: this.confSakafoG
    }).subscribe({
      next: () => {
        this.confMessage = 'Configuration sakafo enregistrée avec succès !';
        this.confAge = null;
        this.confVariationPoid = null;
        this.confSakafoG = null;
      },
      error: (err) => {
        this.confError = err.error?.error || 'Erreur lors de l\'enregistrement de la configuration';
      }
    });
  }
}