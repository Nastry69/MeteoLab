export interface OwWeatherEntry {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OwCurrentResponse {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  
  weather: OwWeatherEntry[];
  wind: { speed: number };
}

export interface OwForecastSlot {
  dt: number;
  dt_txt: string;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: OwWeatherEntry[];
  wind: { speed: number };
}


export interface OwForecastResponse {
  city: { name: string; country: string };
  list: OwForecastSlot[];
}

export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windKmh: number;
  iconUrl: string;
}

export interface ForecastDay {
  date: string;
  label: string;
  tempMin: number;
  tempMax: number;
  description: string;
  iconUrl: string;
}

export function iconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function toKmh(metersPerSecond: number): number {
  return Math.round(metersPerSecond * 3.6);
}

export function toCurrentWeather(dto: OwCurrentResponse): CurrentWeather {
  const condition = dto.weather[0];

  return {
    city: dto.name,
    country: dto.sys.country,
    temp: Math.round(dto.main.temp),
    feelsLike: Math.round(dto.main.feels_like),
    description: condition?.description ?? 'Conditions inconnues',
    humidity: dto.main.humidity,
    windKmh: toKmh(dto.wind.speed),
    iconUrl: iconUrl(condition?.icon ?? '01d'),
  };
}

export function toForecastDays(dto: OwForecastResponse): ForecastDay[] {
  const today = new Date().toISOString().slice(0, 10);
  const byDay = new Map<string, OwForecastSlot[]>();

  for (const slot of dto.list) {
    const date = slot.dt_txt.slice(0, 10);
    if (date === today) continue;

    const slots = byDay.get(date);
    if (slots) {
      slots.push(slot);
    } else {
      byDay.set(date, [slot]);
    }
  }

  const formatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' });

  return [...byDay.entries()].slice(0, 5).map(([date, slots]) => {
    const noonSlot = slots.reduce((closest, slot) => {
      const hour = (s: OwForecastSlot) => Number(s.dt_txt.slice(11, 13));
      return Math.abs(hour(slot) - 12) < Math.abs(hour(closest) - 12) ? slot : closest;
    });
    const condition = noonSlot.weather[0];

    return {
      date,
      label: formatter.format(new Date(`${date}T12:00:00`)),
      tempMin: Math.round(Math.min(...slots.map((s) => s.main.temp_min))),
      tempMax: Math.round(Math.max(...slots.map((s) => s.main.temp_max))),
      description: condition?.description ?? '',
      iconUrl: iconUrl(condition?.icon ?? '01d'),
    };
  });
}
