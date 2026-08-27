import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';

/** Coquille de l'application : ce qui ne change pas d'une page à l'autre. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly currentYear = new Date().getFullYear();
}
