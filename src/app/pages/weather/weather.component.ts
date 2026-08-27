import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WeatherCardComponent } from '../../components/weather-card/weather-card.component';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, WeatherCardComponent],
  template: `
    <div class="weather-page">
      <h1>Météo de {{ city }}</h1>

      <div class="loading" *ngIf="weatherService.loading()">Chargement de la météo...</div>
      <div class="error" *ngIf="weatherService.error()">{{ weatherService.error() }}</div>

      <app-weather-card [weather]="weatherService.weather()"></app-weather-card>

      <div class="forecast" *ngIf="weatherService.forecast().length > 0">
        <h2>Prévisions 5 jours</h2>
        <div class="forecast-days">
          <div class="forecast-day" *ngFor="let day of weatherService.forecast()">
            <div class="date">{{ day.label }}</div>
            <div class="temp-range">{{ day.tempMin }}°C — {{ day.tempMax }}°C</div>
            <div class="description">{{ day.description }}</div>
            <img [src]="day.iconUrl" alt="icon" class="icon" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .weather-page {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    .loading, .error {
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
    }
    .loading {
      background: #e3f2fd;
      color: #1976d2;
    }
    .error {
      background: #ffebee;
      color: #c62828;
    }
    .forecast {
      margin-top: 40px;
    }
    .forecast h2 {
      color: #333;
      margin-bottom: 15px;
    }
    .forecast-days {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }
    .forecast-day {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      background: #f9f9f9;
    }
    .date {
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .temp-range {
      font-size: 16px;
      font-weight: 600;
      margin: 8px 0;
    }
    .description {
      font-size: 12px;
      color: #666;
      text-transform: capitalize;
    }
    .icon {
      width: 40px;
      height: 40px;
      margin: 8px auto;
    }
  `]
})
export class WeatherComponent implements OnInit {
  weatherService = inject(WeatherService);
  city: string = '';
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.city = params['city'];
      this.weatherService.loadWeather(this.city);
      this.weatherService.loadForecast(this.city);
    });
  }
}
