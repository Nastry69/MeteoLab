import { Component, computed, input } from '@angular/core';
import {
  messageFromErrorKind,
  WEATHER_MESSAGES,
  WeatherErrorKind,
} from '../../shared/weather-messages';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  /** Affiche l'indicateur de chargement pendant la requête API. */
  readonly loading = input(false);

  /**
   * Message d'erreur déjà formaté.
   * Prioritaire sur `errorKind` s'il est renseigné.
   */
  readonly errorMessage = input<string | null>(null);

  /**
   * Type d'erreur métier (404, 429, erreur API générique).
   * Utilisé si `errorMessage` est vide.
   */
  readonly errorKind = input<WeatherErrorKind | null>(null);

  protected readonly loadingMessage = WEATHER_MESSAGES.loading;

  readonly displayError = computed(() => {
    const custom = this.errorMessage();
    if (custom) {
      return custom;
    }

    const kind = this.errorKind();
    return kind ? messageFromErrorKind(kind) : null;
  });
}
