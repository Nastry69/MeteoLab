import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Search } from '../../components/search/search';
import { WeatherService } from '../../services/weather.service';

/** Une carte de présentation affichée sous le formulaire. */
interface Highlight {
  title: string;
  text: string;
}

/**
 * Page d'accueil (route /home). Accueille le formulaire de recherche et
 * redirige vers /weather/:city.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, Search],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly router = inject(Router);
  private readonly weatherService = inject(WeatherService);

  /** Dernière ville consultée, pour proposer un retour rapide. */
  protected readonly lastCity = this.weatherService.currentCity;

  /** Raccourcis de navigation vers quelques villes courantes. */
  protected readonly popularCities = ['Paris', 'Lille', 'Lyon', 'Marseille', 'Tokyo'];

  protected readonly highlights: Highlight[] = [
    {
      title: 'Données en direct',
      text: "Chaque recherche interroge l'API OpenWeather : aucune valeur météo n'est écrite en dur dans le code.",
    },
    {
      title: 'Une URL par ville',
      text: "La ville consultée apparaît dans l'adresse (/weather/Paris), ce qui rend chaque résultat partageable et rechargeable.",
    },
    {
      title: 'Thème clair et sombre',
      text: "L'interface suit la préférence de votre système et peut être basculée à tout moment depuis la barre de navigation.",
    },
  ];

  /** Appelé par les raccourcis ci-dessus et par le formulaire de recherche. */
  protected goToCity(city: string): void {
    const trimmed = city.trim();
    if (!trimmed) {
      return;
    }

    this.router.navigate(['/weather', trimmed]);
  }
}
