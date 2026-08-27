import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { Feedback } from '../../components/feedback/feedback';
import { Forecast } from '../../components/forecast/forecast';
import { WeatherCard } from '../../components/weather-card/weather-card';
import { WeatherService } from '../../services/weather.service';

/** Cible de la route /weather/:city. Récupère la ville depuis l'URL. */
@Component({
  selector: 'app-weather',
  imports: [Feedback, Forecast, WeatherCard],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  private readonly route = inject(ActivatedRoute);
  private readonly weatherService = inject(WeatherService);

  // paramMap plutôt que snapshot : en passant de /weather/Paris à
  // /weather/Lille, Angular réutilise le composant et seul le paramètre change.
  protected readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city') ?? '')),
    { initialValue: '' },
  );

  protected readonly weather = this.weatherService.weather;
  protected readonly forecast = this.weatherService.forecast;
  protected readonly loading = this.weatherService.loading;
  protected readonly error = this.weatherService.error;

  constructor() {
    // L'effet se réexécute à chaque changement de city() : c'est ce qui permet de
    // passer de /weather/Paris à /weather/Tokyo sans recréer le composant.
    effect(() => {
      const city = this.city();
      if (!city) {
        return;
      }

      this.weatherService.loadWeather(city);
      this.weatherService.loadForecast(city);
    });
  }
}
