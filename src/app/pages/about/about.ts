import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Un membre du groupe et sa contribution au projet. */
interface Member {
  name: string;
  role: string;
}

/** Une technologie utilisée et la raison de son emploi. */
interface Technology {
  name: string;
  usage: string;
}

/** Page « À propos » (route /about). Statique, aucun appel réseau. */
@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly members: Member[] = [
    {
      name: 'Tristan',
      role: "Configuration de l'environnement, modèles de données et service météo",
    },
    {
      name: 'Dillon',
      role: 'Routing, barre de navigation, pages Accueil et À propos, design system',
    },
    { name: 'Diana', role: 'Formulaire Reactive Forms, états de chargement et collection Postman' },
    { name: 'Melvyn', role: 'Page météo, carte de résultat et prévisions à 5 jours' },
  ];

  protected readonly technologies: Technology[] = [
    {
      name: 'Angular',
      usage: 'Composants autonomes, routing, signals et injection de dépendances',
    },
    { name: 'TypeScript', usage: "Typage des réponses de l'API et des modèles internes" },
    {
      name: 'HTML / CSS',
      usage: 'Design system maison basé sur des variables CSS, thème clair et sombre',
    },
    { name: 'HttpClient', usage: "Requêtes HTTP vers l'API REST OpenWeather" },
    { name: 'OpenWeather API', usage: 'Météo actuelle et prévisions sur 5 jours' },
    { name: 'Postman', usage: 'Test et documentation des requêtes avant leur intégration' },
  ];
}
