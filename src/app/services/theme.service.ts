import { Injectable, effect, signal } from '@angular/core';

/** Les deux thèmes proposés par le design system. */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'meteolab-theme';

/**
 * Gère le thème clair/sombre. L'effect pose data-theme sur <html>, et toutes
 * les variables CSS du design system réagissent à cet attribut.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(readInitialTheme());

  /** Thème courant, en lecture seule pour les composants. */
  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this._theme();
      document.documentElement.setAttribute('data-theme', theme);

      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Stockage bloqué : le thème reste valable pour la session.
      }
    });
  }

  /** Bascule entre le thème clair et le thème sombre. */
  toggle(): void {
    this._theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }
}

/** Thème au démarrage : choix enregistré, sinon préférence du système. */
function readInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // Lecture impossible : on retombe sur la préférence système.
  }

  // matchMedia n'existe pas partout (environnement de test notamment).
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
}
