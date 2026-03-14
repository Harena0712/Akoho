import { afterNextRender, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-configuration-sakafo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuration-sakafo.html',
  styleUrl: './configuration-sakafo.css'
})
export class ConfigurationSakafoComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  races: any[] = [];

  confIdRace: number | null = null;
  confAge: number | null = null;
  confVariationPoid: number | null = null;
  confSakafoG: number | null = null;
  confMessage = '';
  confError = '';

  constructor() {
    afterNextRender(() => this.loadRaces());
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

  private loadRaces() {
    this.api.getRaces().subscribe({
      next: (data) => {
        this.races = data;
        if (this.confIdRace == null && this.races.length > 0) {
          this.confIdRace = this.races[0].id;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.confError = 'Impossible de charger les races';
      }
    });
  }
}