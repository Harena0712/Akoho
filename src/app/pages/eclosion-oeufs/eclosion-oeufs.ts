import { Component, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-eclosion-oeufs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './eclosion-oeufs.html',
  styleUrl: './eclosion-oeufs.css'
})
export class EclosionOeufsComponent {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  oeufs: any[] = [];
  idLotAtody: number | null = null;
  nombreEclos: number | null = null;
  date = '';
  message = '';
  error = '';

  constructor() {
    afterNextRender(() => {
      this.loadOeufs();
    });
  }

  loadOeufs() {
    this.api.getLotAtody().subscribe({
      next: (data) => {
        this.oeufs = data.filter(o => o.nbAtody > 0);
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Impossible de charger les oeufs'
    });
  }

  onSubmit() {
    if (!this.idLotAtody || !this.nombreEclos || !this.date) return;
    this.message = '';
    this.error = '';
    this.api.createIncubation({ idLotAtody: this.idLotAtody, nbAtodyF: this.nombreEclos, date: this.date }).subscribe({
      next: () => {
        this.message = 'Éclosion enregistrée avec succès ! Nouveau lot créé.';
        this.idLotAtody = null;
        this.nombreEclos = null;
        this.date = '';
        this.loadOeufs();
      },
      error: (err) => this.error = err.error?.error || 'Erreur lors de l\'enregistrement'
    });
  }
}
