import { Component, input } from '@angular/core';

import { CurrentWeather } from '../../models/weather.model';

/**
 * Carte de résultat : les 8 informations exigées par le cahier des charges.
 * Composant purement présentationnel — il reçoit ses données et n'appelle rien.
 */
@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  readonly weather = input.required<CurrentWeather>();
}
