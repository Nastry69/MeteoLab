import { Component, input } from '@angular/core';

import { ForecastDay } from '../../models/weather.model';

/**
 * Prévisions à 5 jours — fonctionnalité libre, alimentée par le second endpoint
 * OpenWeather (/forecast). L'agrégation des créneaux de 3 h en journées est faite
 * en amont par toForecastDays() : ce composant ne fait qu'afficher.
 */
@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  readonly days = input<ForecastDay[]>([]);
}
