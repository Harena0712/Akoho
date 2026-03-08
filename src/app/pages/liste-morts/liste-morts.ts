import { Component, afterNextRender, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-liste-morts',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './liste-morts.html',
  styleUrl: './liste-morts.css'
})
export class ListeMortsComponent {
  private api = inject(ApiService);
  morts: any[] = [];

  constructor() {
    afterNextRender(() => {
      this.api.getLotMaty().subscribe(data => this.morts = data);
    });
  }
}
