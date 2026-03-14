import { Component, afterNextRender, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-liste-oeufs',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './liste-oeufs.html',
  styleUrls: ['./liste-oeufs.css']
})
export class ListeOeufsComponent {
  private api = inject(ApiService);
  oeufs: any[] = [];
  dateReference = '';
  capacites: any[] = [];
  capaciteError = '';

  constructor() {
    afterNextRender(() => {
      this.api.getLotAtody().subscribe(data => this.oeufs = data);
      this.dateReference = new Date().toISOString().slice(0, 10);
      this.chargerCapacites();
    });
  }

  chargerCapacites() {
    if (!this.dateReference) {
      this.capacites = [];
      return;
    }
    this.capaciteError = '';
    this.api.getCapaciteOeufsParDate(this.dateReference).subscribe({
      next: (data) => this.capacites = data,
      error: () => this.capaciteError = 'Impossible de charger la synthèse des oeufs'
    });
  }

  refreshDateReference() {
    this.dateReference = new Date().toISOString().slice(0, 10);
    this.chargerCapacites();
  }
}
