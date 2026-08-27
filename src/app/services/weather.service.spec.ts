import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../environments/environment';
import { OwCurrentResponse } from '../models/weather.model';
import { WeatherService } from './weather.service';

const PARIS: OwCurrentResponse = {
  name: 'Paris',
  sys: { country: 'FR' },
  main: { temp: 23.6, feels_like: 24.4, humidity: 58 },
  weather: [{ id: 800, main: 'Clear', description: 'ciel dégagé', icon: '01d' }],
  wind: { speed: 3.5 },
};

describe('WeatherService', () => {
  let service: WeatherService;
  let http: HttpTestingController;

  beforeEach(() => {
    environment.openWeatherApiKey = 'cle-de-test';

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WeatherService);
    http = TestBed.inject(HttpTestingController);
  });

  it('normalise la réponse de l’API (°C arrondis, vent en km/h, icône)', () => {
    service.loadWeather('Paris');
    http.expectOne((r) => r.url.endsWith('/weather')).flush(PARIS);

    expect(service.weather()).toEqual({
      city: 'Paris',
      country: 'FR',
      temp: 24,
      feelsLike: 24,
      description: 'ciel dégagé',
      humidity: 58,
      windKmh: 13,
      iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
    });
    expect(service.loading()).toBe(false);
    http.verify();
  });

  it('demande des °C et du français à l’API', () => {
    service.loadWeather('Paris');
    const req = http.expectOne((r) => r.url.endsWith('/weather'));

    expect(req.request.params.get('units')).toBe('metric');
    expect(req.request.params.get('lang')).toBe('fr');
    expect(req.request.params.get('q')).toBe('Paris');

    req.flush(PARIS);
    http.verify();
  });

  it('ressert la même ville depuis le cache sans rappeler l’API', () => {
    service.loadWeather('Paris');
    http.expectOne((r) => r.url.endsWith('/weather')).flush(PARIS);

    service.loadWeather('paris');

    http.expectNone((r) => r.url.endsWith('/weather'));
    expect(service.weather()?.city).toBe('Paris');
  });

  it('traduit 404 en « Ville introuvable. »', () => {
    service.loadWeather('azertyuiop');
    http
      .expectOne((r) => r.url.endsWith('/weather'))
      .flush({}, { status: 404, statusText: 'Not Found' });

    expect(service.error()).toBe('Ville introuvable.');
    expect(service.weather()).toBeNull();
    expect(service.loading()).toBe(false);
  });

  it('traduit 429 en message d’attente', () => {
    service.loadWeather('Paris');
    http
      .expectOne((r) => r.url.endsWith('/weather'))
      .flush({}, { status: 429, statusText: 'Too Many Requests' });

    expect(service.error()).toBe('Trop de requêtes, veuillez réessayer dans quelques instants.');
  });

  it('traduit toute autre erreur en message générique', () => {
    service.loadWeather('Paris');
    http
      .expectOne((r) => r.url.endsWith('/weather'))
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(service.error()).toBe('Impossible de récupérer les données météo.');
  });
});
