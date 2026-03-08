import { Component, afterNextRender, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-liste-oeufs',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './liste-oeufs.html',
  styleUrls: ['./liste-oeufs.css']
})
export class ListeOeufsComponent {
  private api = inject(ApiService);
  oeufs: any[] = [];

  constructor() {
    afterNextRender(() => {
      this.api.getLotAtody().subscribe(data => this.oeufs = data);
    });
  }
}
