import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { ThemeService } from '../../services/theme.service';

/** Un lien de la barre de navigation. */
interface NavLink {
  path: string;
  label: string;
}

/** Barre de navigation affichée sur toutes les pages. */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly theme = this.themeService.theme;

  /** Ouverture du menu sur mobile. */
  protected readonly menuOpen = signal(false);

  protected readonly links: NavLink[] = [
    { path: '/home', label: 'Accueil' },
    { path: '/about', label: 'A propos' },
  ];

  constructor() {
    // Sans ça, le menu mobile reste ouvert par-dessus la nouvelle page.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}
