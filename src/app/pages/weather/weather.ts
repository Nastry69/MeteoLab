import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

/** Cible de la route /weather/:city. Récupère la ville depuis l'URL. */
@Component({
  selector: 'app-weather',
  templateUrl: './weather.html',
})
export class Weather {
  private readonly route = inject(ActivatedRoute);

  // paramMap plutôt que snapshot : en passant de /weather/Paris à
  // /weather/Lille, Angular réutilise le composant et seul le paramètre change.
  protected readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city') ?? '')),
    { initialValue: '' },
  );
}
