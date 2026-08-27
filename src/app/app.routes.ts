import { Routes } from '@angular/router';
import { WeatherComponent } from './pages/weather/weather.component';

export const routes: Routes = [
  { path: 'weather/:city', component: WeatherComponent },
];
