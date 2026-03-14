import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/accueil/accueil').then(m => m.AccueilComponent) },
  { path: 'configuration', pathMatch: 'full', redirectTo: 'configuration/races' },
  { path: 'configuration/races', loadComponent: () => import('./pages/configuration/configuration').then(m => m.ConfigurationComponent) },
  { path: 'configuration/sakafo', loadComponent: () => import('./pages/configuration-sakafo/configuration-sakafo').then(m => m.ConfigurationSakafoComponent) },
  { path: 'tableau-conf-sakafo', loadComponent: () => import('./pages/tableau-conf-sakafo/tableau-conf-sakafo').then(m => m.TableauConfSakafoComponent) },
  { path: 'poids-akoho', loadComponent: () => import('./pages/poids-akoho/poids-akoho').then(m => m.PoidsAkohoComponent) },
  { path: 'inserer-lot', loadComponent: () => import('./pages/inserer-lot/inserer-lot').then(m => m.InsererLotComponent) },
  { path: 'inserer-mort', loadComponent: () => import('./pages/inserer-mort/inserer-mort').then(m => m.InsererMortComponent) },
  { path: 'inserer-oeufs', loadComponent: () => import('./pages/inserer-oeufs/inserer-oeufs').then(m => m.InsererOeufsComponent) },
  { path: 'eclosion-oeufs', loadComponent: () => import('./pages/eclosion-oeufs/eclosion-oeufs').then(m => m.EclosionOeufsComponent) },
  { path: 'liste-lots', loadComponent: () => import('./pages/liste-lots/liste-lots').then(m => m.ListeLotsComponent) },
  { path: 'liste-morts', loadComponent: () => import('./pages/liste-morts/liste-morts').then(m => m.ListeMortsComponent) },
  { path: 'liste-oeufs', loadComponent: () => import('./pages/liste-oeufs/liste-oeufs').then(m => m.ListeOeufsComponent) },
  { path: 'situation', loadComponent: () => import('./pages/situation/situation').then(m => m.SituationComponent) },
];
