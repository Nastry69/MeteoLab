import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Page affichée par la route générique, quand l'URL ne correspond à rien. */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
