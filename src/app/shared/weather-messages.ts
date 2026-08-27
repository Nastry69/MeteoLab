/** Messages d'interface liés au formulaire et aux appels API météo. */

export const WEATHER_MESSAGES = {
  invalidCity: 'Veuillez saisir une ville.',
  loading: 'Chargement de la météo...',
  notFound: 'Ville introuvable.',
  apiError: 'Impossible de récupérer les données météo.',
  rateLimit: 'Trop de requêtes, veuillez réessayer dans quelques instants.',
} as const;

export type WeatherErrorKind = 'not_found' | 'api_error' | 'rate_limit';

/**
 * Associe un code HTTP OpenWeather au message affiché à l'utilisateur.
 */
export function messageFromHttpStatus(status: number): string {
  if (status === 404) {
    return WEATHER_MESSAGES.notFound;
  }
  if (status === 429) {
    return WEATHER_MESSAGES.rateLimit;
  }
  return WEATHER_MESSAGES.apiError;
}

/**
 * Associe un type d'erreur métier au message affiché.
 */
export function messageFromErrorKind(kind: WeatherErrorKind): string {
  switch (kind) {
    case 'not_found':
      return WEATHER_MESSAGES.notFound;
    case 'rate_limit':
      return WEATHER_MESSAGES.rateLimit;
    default:
      return WEATHER_MESSAGES.apiError;
  }
}
