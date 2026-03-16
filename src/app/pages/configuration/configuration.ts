import { Component, inject } from '@angular/core';
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

  raceLibelle = '';
  racePuGg: number | null = null;
  racePvGg: number | null = null;
  racePrixAtody: number | null = null;
  raceCapaciteOeufs: number | null = null;
  raceMale: number | null = null;
  raceFemelle: number | null = null;
  raceOeufPourri: number | null = null;
  raceMortMale: number | null = null;
  raceMortFemelle: number | null = null;
  raceNbJourIncubation: number | null = null;
  raceMessage = '';
  raceError = '';

  onRaceSubmit() {
    if (
      !this.raceLibelle
      || this.racePuGg == null
      || this.racePvGg == null
      || this.racePrixAtody == null
      || this.raceCapaciteOeufs == null
      || this.raceMale == null
      || this.raceFemelle == null
      || this.raceOeufPourri == null
      || this.raceMortMale == null
      || this.raceMortFemelle == null
      || this.raceNbJourIncubation == null
    ) {
      return;
    }

    this.raceMessage = '';
    this.raceError = '';

    this.api.createRace({
      libelle: this.raceLibelle,
      puGg: this.racePuGg,
      pvGg: this.racePvGg,
      prixAtody: this.racePrixAtody,
      capaciteOeufs: this.raceCapaciteOeufs,
      male: this.raceMale,
      femelle: this.raceFemelle,
      oeufPourri: this.raceOeufPourri,
      mortMale: this.raceMortMale,
      mortFemelle: this.raceMortFemelle,
      nbJourIncubation: this.raceNbJourIncubation
    }).subscribe({
      next: (race) => {
        this.raceMessage = 'Race enregistrée avec succès !';
        this.raceLibelle = '';
        this.racePuGg = null;
        this.racePvGg = null;
        this.racePrixAtody = null;
        this.raceCapaciteOeufs = null;
        this.raceMale = null;
        this.raceFemelle = null;
        this.raceOeufPourri = null;
        this.raceMortMale = null;
        this.raceMortFemelle = null;
        this.raceNbJourIncubation = null;
      },
      error: (err) => {
        this.raceError = err.error?.error || 'Erreur lors de l\'enregistrement de la race';
      }
    });
  }
}