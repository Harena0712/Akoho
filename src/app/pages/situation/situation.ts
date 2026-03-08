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
