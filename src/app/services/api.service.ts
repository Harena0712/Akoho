import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Race
  getRaces() { return this.http.get<any[]>(`${BASE}/race`); }

  // Lot
  getLots() { return this.http.get<any[]>(`${BASE}/lot`); }
  createLot(data: { idRace: number; nb: number; age: number; date: string }) {
    return this.http.post<any>(`${BASE}/lot`, data);
  }

  // Lot Maty (poules mortes)
  getLotMaty() { return this.http.get<any[]>(`${BASE}/lot-maty`); }
  createLotMaty(data: { idLot: number; nbMaty: number; date: string }) {
    return this.http.post<any>(`${BASE}/lot-maty`, data);
  }

  // Lot Atody (oeufs récoltés)
  getLotAtody() { return this.http.get<any[]>(`${BASE}/lot-atody`); }
  createLotAtody(data: { idLot: number; nbAtody: number; date: string }) {
    return this.http.post<any>(`${BASE}/lot-atody`, data);
  }

  // Incubation (éclosion)
  createIncubation(data: { idLotAtody: number; nbAtodyF: number; date: string }) {
    return this.http.post<any>(`${BASE}/incubation`, data);
  }

  // Situation
  getSituation(date: string) {
    return this.http.get<any[]>(`${BASE}/situation?date=${date}`);
  }
}
