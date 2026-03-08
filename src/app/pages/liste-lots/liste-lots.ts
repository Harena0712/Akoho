import { Component, afterNextRender, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-liste-lots',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './liste-lots.html',
  styleUrl: './liste-lots.css'
})
export class ListeLotsComponent {
  private api = inject(ApiService);
  lots: any[] = [];

  constructor() {
    afterNextRender(() => {
      this.api.getLots().subscribe(data => this.lots = data);
    });
  }
}
