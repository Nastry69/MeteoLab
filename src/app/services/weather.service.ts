import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, map, of, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CurrentWeather,
  ForecastDay,
  OwCurrentResponse,
  OwForecastResponse,
  toCurrentWeather,
  toForecastDays,
} from '../models/weather.model';

const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  private readonly _weather = signal<CurrentWeather | null>(null);
  private readonly _forecast = signal<ForecastDay[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentCity = signal<string | null>(null);

  readonly weather = this._weather.asReadonly();
  readonly forecast = this._forecast.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentCity = this._currentCity.asReadonly();

  readonly hasWeather = computed(() => this._weather() !== null);

  private readonly currentCache = new Map<string, CacheEntry<CurrentWeather>>();
  private readonly forecastCache = new Map<string, CacheEntry<ForecastDay[]>>();

  loadWeather(city: string): void {
    const key = this.cacheKey(city);
    this._currentCity.set(city);
    this._error.set(null);

    const cached = this.readCache(this.currentCache, key);
    if (cached) {
      this._weather.set(cached);
      return;
    }

    if (!this.isConfigured()) {
      this._weather.set(null);
      this._error.set('Clé API absente : renseignez src/environments/environment.ts.');
      return;
    }

    this._loading.set(true);

    this.http
      .get<OwCurrentResponse>(`${environment.openWeatherBaseUrl}/weather`, {
        params: this.params(city),
      })
      .pipe(
        map(toCurrentWeather),
        tap((data) => this.writeCache(this.currentCache, key, data)),
        catchError((err: HttpErrorResponse) => {
          this._error.set(errorMessage(err));
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe((data) => this._weather.set(data));
  }

  loadForecast(city: string): void {
    const key = this.cacheKey(city);

    const cached = this.readCache(this.forecastCache, key);
    if (cached) {
      this._forecast.set(cached);
      return;
    }

    if (!this.isConfigured()) {
      this._forecast.set([]);
      return;
    }

    this.http
      .get<OwForecastResponse>(`${environment.openWeatherBaseUrl}/forecast`, {
        params: this.params(city),
      })
      .pipe(
        map(toForecastDays),
        tap((days) => this.writeCache(this.forecastCache, key, days)),
        catchError(() => of([])),
      )
      .subscribe((days) => this._forecast.set(days));
  }

  reset(): void {
    this._weather.set(null);
    this._forecast.set([]);
    this._error.set(null);
    this._loading.set(false);
    this._currentCity.set(null);
  }

  private isConfigured(): boolean {
    const key = environment.openWeatherApiKey;
    return key.length > 0 && key !== 'VOTRE_CLE_API_ICI';
  }

  private params(city: string): HttpParams {
    return new HttpParams()
      .set('q', city)
      .set('appid', environment.openWeatherApiKey)
      .set('units', 'metric')
      .set('lang', 'fr');
  }

  private cacheKey(city: string): string {
    return city.trim().toLowerCase();
  }

  private readCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private writeCache<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T): void {
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  }
}

function errorMessage(err: HttpErrorResponse): string {
  switch (err.status) {
    case 404:
      return 'Ville introuvable.';
    case 429:
      return 'Trop de requêtes, veuillez réessayer dans quelques instants.';
    default:
      return 'Impossible de récupérer les données météo.';
  }
}
