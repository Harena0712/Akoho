import { Component, afterNextRender, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-situation',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './situation.html',
  styleUrl: './situation.css'
})
export class SituationComponent {
  private api = inject(ApiService);
  dateFilter = '';
  data: any[] = [];
  filtered = false;

  get totalBenefice() {
    return this.data.reduce((sum, row) => sum + row.benefice, 0);
  }

  get totalRevenu() {
    return this.data.reduce((sum, row) => {
      const prixLot = Number(row.prixLot) || 0;
      const valeurAtody = Number(row.valeurAtody) || 0;
      return sum + prixLot + valeurAtody;
    }, 0);
  }

  get totalCout() {
    return this.data.reduce((sum, row) => {
      const achat = Number(row.achat) || 0;
      const prixSakafo = Number(row.prixSakafo) || 0;
      const valeurLamoka = Number(row.valeurOeufsPourri) || 0;
      return sum + achat + prixSakafo + valeurLamoka;
    }, 0);
  }

  get totalGains() {
    return this.data
      .filter(row => row.benefice > 0)
      .reduce((sum, row) => sum + row.benefice, 0);
  }

  get totalPertes() {
    return this.data
      .filter(row => row.benefice < 0)
      .reduce((sum, row) => sum + Math.abs(row.benefice), 0);
  }

  voirSituation() {
    if (!this.dateFilter) return;
    this.api.getSituation(this.dateFilter).subscribe({
      next: (rows) => {
        this.data = rows;
        this.filtered = true;
      },
      error: () => {
        this.data = [];
        this.filtered = false;
      }
    });
  }
}
