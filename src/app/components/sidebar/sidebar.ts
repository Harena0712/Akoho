import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Nouveau lot', route: '/inserer-lot', icon: 'plus' },
    { label: 'Poules mortes', route: '/inserer-mort', icon: 'skull' },
    { label: 'Oeufs récoltés', route: '/inserer-oeufs', icon: 'egg' },
    { label: 'Éclosion', route: '/eclosion-oeufs', icon: 'hatch' },
    { label: 'Situation', route: '/situation', icon: 'chart' },
  ];
}
