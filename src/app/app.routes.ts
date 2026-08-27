import { ResolveFn, Routes } from '@angular/router';

/** Titre de l'onglet, calculé à partir du paramètre de route. */
const weatherTitle: ResolveFn<string> = (route) =>
  `Météo de ${route.paramMap.get('city') ?? 'la ville'} | MeteoLab`;

/**
 * Table de routage. loadComponent charge chaque page à la demande, ce qui
 * allège le chargement initial.
 */
export const routes: Routes = [
  // L'URL racine redirige vers /home.
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    title: 'Accueil | MeteoLab',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    // :city est un paramètre dynamique, lu dans le composant via ActivatedRoute.
    path: 'weather/:city',
    title: weatherTitle,
    loadComponent: () => import('./pages/weather/weather').then((m) => m.Weather),
  },
  {
    path: 'about',
    title: 'À propos | MeteoLab',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },

  // Route générique : doit rester en dernier, sinon elle capterait tout.
  {
    path: '**',
    title: 'Page introuvable | MeteoLab',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
