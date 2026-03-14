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
  raceMessage = '';
  raceError = '';

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
      },
      error: (err) => {
        this.raceError = err.error?.error || 'Erreur lors de l\'enregistrement de la race';
      }
    });
  }
}