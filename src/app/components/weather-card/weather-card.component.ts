import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather } from '../../models/weather.model';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-card" *ngIf="weather">
      <div class="header">
        <h1>{{ weather.city }} ({{ weather.country }})</h1>
      </div>
      <div class="weather-main">
        <div class="temperature">{{ weather.temp }}°C</div>
        <div class="description">{{ weather.description }}</div>
        <img [src]="weather.iconUrl" alt="icon" class="icon" />
      </div>
      <div class="details">
        <div class="detail">
          <span class="label">Ressenti:</span>
          <span class="value">{{ weather.feelsLike }}°C</span>
        </div>
        <div class="detail">
          <span class="label">Humidité:</span>
          <span class="value">{{ weather.humidity }}%</span>
        </div>
        <div class="detail">
          <span class="label">Vent:</span>
          <span class="value">{{ weather.windKmh }} km/h</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .weather-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      background: #f9f9f9;
    }
    .header {
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .weather-main {
      text-align: center;
      margin-bottom: 20px;
    }
    .temperature {
      font-size: 48px;
      font-weight: bold;
      margin: 10px 0;
    }
    .description {
      font-size: 16px;
      color: #666;
      text-transform: capitalize;
    }
    .icon {
      width: 48px;
      height: 48px;
      margin: 10px 0;
    }
    .details {
      border-top: 1px solid #ddd;
      padding-top: 15px;
    }
    .detail {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 14px;
    }
    .label {
      font-weight: 600;
    }
    .value {
      color: #666;
    }
  `]
})
export class WeatherCardComponent {
  @Input() weather: CurrentWeather | null = null;
}
