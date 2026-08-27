# MeteoLab

Application web de météo développée avec Angular et l'API OpenWeather.

L'utilisateur saisit une ville dans un formulaire, l'application interroge l'API OpenWeather et
affiche la météo actuelle de cette ville ainsi que les prévisions des 5 prochains jours. La ville
consultée apparaît dans l'URL (`/weather/Paris`), ce qui rend chaque résultat partageable et
rechargeable. Aucune donnée météo n'est écrite en dur : tout provient de l'API.

## Membres du groupe

| Membre | Contribution |
| --- | --- |
| **Tristan** | Configuration de l'environnement, modèles de données, service météo (HttpClient, état, cache, erreurs), tests unitaires |
| **Dillon** | Routing, barre de navigation, pages Accueil et À propos, page 404, design system et thème clair/sombre |
| **Diana** | Formulaire Reactive Forms, composant d'états de chargement et d'erreur, collection Postman |
| **Melvyn** | Page météo, carte de résultat, prévisions à 5 jours |

## Technologies

- **Angular 22** (composants standalone, signals, nouveau flux de contrôle `@if` / `@for`)
- **TypeScript 6**
- **HTML / CSS** — CSS natif avec variables (design tokens), aucune librairie de style
- **RxJS** — `HttpClient` et opérateurs (`map`, `catchError`, `finalize`)
- **API OpenWeather** — endpoints `/weather` et `/forecast`
- **Postman** — test et documentation des requêtes
- **Vitest** — tests unitaires

## Installation

Prérequis : Node.js 22 ou supérieur.

```bash
npm install
```

```bash
npm start
```

L'application est disponible sur `http://localhost:4200/`.

Autres commandes :

```bash
npm test
```

```bash
npm run build
```

## Configuration de la clé API

La clé API n'est **pas** versionnée. Le dépôt contient uniquement un modèle,
`src/environments/environment.example.ts`.

1. Créer un compte gratuit sur [openweathermap.org](https://openweathermap.org/) et récupérer sa
   clé dans l'onglet « API keys ».
2. Copier le modèle :

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

3. Ouvrir `src/environments/environment.ts` et remplacer `VOTRE_CLE_API_ICI` par sa propre clé.

> ⚠️ Une clé OpenWeather n'est pas active immédiatement : comptez jusqu'à 2 heures après sa
> création. Pendant ce délai, l'API répond `401 Unauthorized` même si la clé est correctement
> copiée.

`src/environments/environment.ts` est listé dans `.gitignore` : la clé ne peut pas être poussée
sur le dépôt, même par inadvertance.

## Fonctionnalités obligatoires

- **Page d'accueil** (`/home`) — présentation de l'application et formulaire de recherche
- **Formulaire de recherche** — Reactive Forms, champ obligatoire, message
  « Veuillez saisir une ville. » si le formulaire est soumis vide
- **Routing** — `/home`, `/weather/:city`, `/about`, redirection depuis `/` et page 404 sur toute
  URL inconnue
- **Affichage météo** — nom de la ville, pays, température, ressenti, description, humidité,
  vitesse du vent et icône météo, tous issus de l'API
- **Service dédié** — l'intégralité des appels HTTP passe par `WeatherService` ; aucun composant
  n'utilise `HttpClient` directement
- **Gestion du chargement et des erreurs** — indicateur pendant la requête, et messages
  distincts pour ville inexistante, erreur API et dépassement de quota

## Fonctionnalité supplémentaire — prévisions à 5 jours

L'application affiche, sous la météo du jour, les prévisions des 5 prochains jours (température
minimale et maximale, description, icône). Elle s'appuie sur un **second endpoint** OpenWeather,
`/forecast`.

Cet endpoint ne renvoie pas des journées mais **40 créneaux de 3 heures**. Le regroupement est
fait dans `toForecastDays()` (`src/app/models/weather.model.ts`) :

- les créneaux sont groupés par date ;
- le jour courant est **exclu** — l'API n'en renvoie que les créneaux restants, ses minimum et
  maximum seraient donc faux ;
- pour chaque jour, on retient le minimum et le maximum sur l'ensemble des créneaux, et la
  condition météo du créneau **le plus proche de midi**, plus représentatif de la journée qu'une
  moyenne qui mélangerait la pluie du petit matin avec le soleil de l'après-midi.

Autres ajouts : thème clair/sombre mémorisé, titres d'onglet dynamiques par route, chargement
différé des pages (`loadComponent`).

## Architecture

```
src/
  environments/
    environment.example.ts    modèle versionné
    environment.ts            clé réelle, ignorée par Git
  app/
    models/
      weather.model.ts        types de l'API + types d'affichage + conversions
    services/
      weather.service.ts      appels HTTP, état, cache, erreurs
      theme.service.ts        thème clair/sombre
    shared/
      weather-messages.ts     messages d'interface centralisés
    components/
      navbar/                 navigation
      search/                 formulaire de recherche
      feedback/               chargement et erreurs
      weather-card/           carte météo du jour
      forecast/               prévisions 5 jours
    pages/
      home/  weather/  about/  not-found/
    app.routes.ts             table de routage
    app.config.ts             providers (router, HttpClient)
```

**Flux de données**

```
Utilisateur → formulaire (Search) → événement citySubmit → page Accueil
   → Router.navigate(['/weather', ville])
      → page Weather lit :city via ActivatedRoute
         → WeatherService → HttpClient → OpenWeather
            → réponse JSON → conversion en modèle d'affichage → signals
               → WeatherCard / Forecast
```

**Séparation des types.** Les types `Ow*` décrivent la réponse brute de l'API (snake_case,
tableaux, températures et vitesses à convertir) et ne sortent jamais du service. Les composants
reçoivent des modèles à plat (`CurrentWeather`, `ForecastDay`), déjà arrondis et convertis. Si
OpenWeather changeait son format, seul le service serait à modifier, aucun template.

**Gestion de l'état.** L'état (ville courante, données météo, prévisions, chargement, erreur) est
exposé par le service sous forme de **signals** en lecture seule. Ce n'est pas un choix
esthétique : l'application est *zoneless* (aucun `zone.js` dans les dépendances), donc rien ne
déclenche automatiquement le rafraîchissement du template à la fin d'un appel asynchrone. Chaque
`set()` sur un signal notifie explicitement Angular, ce qui garantit l'affichage des données dès
leur arrivée. Une alternative aurait été `BehaviorSubject` + pipe `async`, fonctionnelle mais plus
verbeuse.

**Communication entre composants.** `Search` remonte la ville saisie par un `output()`.
`WeatherCard`, `Forecast` et `Feedback` reçoivent leurs données par `input()`. L'état partagé
entre pages transite par le service. (`input()` et `output()` sont les équivalents modernes,
fondés sur les signals, de `@Input` et `@Output`.)

## API OpenWeather

**Base :** `https://api.openweathermap.org/data/2.5`

| Usage | Méthode | Endpoint |
| --- | --- | --- |
| Météo actuelle | `GET` | `/weather?q={ville}&appid={clé}&units=metric&lang=fr` |
| Prévisions 5 jours | `GET` | `/forecast?q={ville}&appid={clé}&units=metric&lang=fr` |

**Paramètres**

| Paramètre | Rôle |
| --- | --- |
| `q` | nom de la ville recherchée |
| `appid` | clé API |
| `units` | `metric` pour obtenir des degrés Celsius |
| `lang` | `fr` pour des descriptions en français |

**Données exploitées** — `name`, `sys.country`, `main.temp`, `main.feels_like`, `main.humidity`,
`weather[0].description`, `weather[0].icon`, `wind.speed`, et pour les prévisions `list[].dt_txt`,
`list[].main.temp_min`, `list[].main.temp_max`.

**Conversion des unités.** La réponse brute d'OpenWeather est en Kelvin. Plutôt que de convertir
côté client, nous passons `units=metric` dans la requête : l'API renvoie directement des degrés
Celsius, la conversion n'existe qu'à un seul endroit et il n'y a pas de code de calcul à tester.
L'alternative aurait été un `@Pipe` appliquant `k - 273.15` dans les templates. En revanche,
`units=metric` renvoie le vent en **m/s** alors que l'interface l'affiche en km/h : cette seule
conversion (`× 3.6`) est faite côté application, dans `toKmh()`.

**Limitation du nombre d'appels.** Le plan gratuit autorise 60 appels par minute et répond `429`
au-delà. Deux garde-fous :

1. la recherche ne part qu'à la **soumission** du formulaire — pas de recherche à la frappe ;
2. le service maintient un **cache mémoire** (`Map`, durée de vie 10 minutes, clé normalisée en
   minuscules) : rechercher « Paris » puis « paris » ne déclenche qu'une seule requête.

Si nous avions retenu une recherche à la volée, il aurait fallu `debounceTime` et
`distinctUntilChanged` sur les frappes clavier.

**Gestion des erreurs** — le code HTTP est traduit en message utilisateur dans
`messageFromHttpStatus()` :

| Situation | Message |
| --- | --- |
| Formulaire vide (bloqué avant tout appel) | Veuillez saisir une ville. |
| `404` ville inexistante | Ville introuvable. |
| `429` quota dépassé | Trop de requêtes, veuillez réessayer dans quelques instants. |
| Autre erreur (`401`, `500`, réseau) | Impossible de récupérer les données météo. |

L'indicateur de chargement est remis à zéro via `finalize()`, qui s'exécute aussi bien après un
succès qu'après une erreur : l'interface ne peut pas rester bloquée sur « Chargement… ».

## Postman

La collection se trouve dans `postman/Weather_App.postman_collection.json`, accompagnée de
`postman/README.md`.

1. Postman → **Import** → sélectionner `Weather_App.postman_collection.json`
2. Dans la collection **Weather App**, renseigner la variable `api_key` avec sa clé OpenWeather
3. Optionnel : modifier la variable `city` pour tester une autre ville

| Dossier | Requêtes |
| --- | --- |
| Current Weather | Paris, Lille, Tokyo, ville dynamique `{{city}}` |
| Forecast | Prévisions 5 jours (Paris et `{{city}}`) |
| Tests | Ville inexistante (404), clé API invalide (401) |

Variables : `base_url`, `api_key`, `city`. La clé est laissée **vide** dans le fichier versionné.

## Difficultés rencontrées

**1. Le template ne se mettait pas à jour après la réponse de l'API.** Les données arrivaient bien
(visibles dans l'onglet Réseau et en console) mais l'affichage restait vide. Le projet généré par
Angular 22 est *zoneless* : `zone.js` n'est pas installé, donc aucun mécanisme ne déclenche la
détection de changements à la fin d'une souscription. Nous avons converti tout l'état du service
en signals, dont chaque écriture notifie Angular explicitement.

**2. Les températures arrivaient en Kelvin.** L'API renvoie `288.15` là où nous attendions `15`.
Après lecture de la documentation, nous avons choisi de déléguer la conversion à l'API via
`units=metric` plutôt que de la faire côté client. Nous avons cependant découvert que le vent
restait en m/s, ce qui affichait « 4 km/h » pour un vent réel de 14 km/h : il a fallu ajouter une
conversion explicite `× 3.6`.

**3. Du texte invisible à cause du thème sombre.** Le champ de recherche imposait un fond blanc
sans définir la couleur du texte, qui héritait du blanc du thème sombre. Plus subtil : le libellé
des boutons disparaissait au survol, parce que la règle globale `a:hover` (spécificité 0,1,1)
l'emportait sur `.btn--primary` (0,1,0) et repeignait le texte avec la couleur du fond survolé.
Corrigé en repassant ces règles sur les variables du design system et en réimposant `color` sur
`.btn--primary:hover`. Leçon retenue : ne jamais coder une couleur en dur quand un thème existe.

**4. Divergence entre les branches.** Deux membres ont modifié `app.routes.ts` en parallèle, l'un
sans avoir récupéré le travail de l'autre : la fusion a fait disparaître trois routes sur quatre.
Nous avons résolu le conflit manuellement et adopté la règle de récupérer `main` avant chaque
nouvelle tâche.

## Améliorations possibles

- **Intercepteur HTTP** pour injecter la clé API automatiquement, plutôt que de la répéter dans
  chaque requête du service
- **Autocomplétion** des villes via l'API Geocoding d'OpenWeather, pour éviter les fautes de
  frappe et lever l'ambiguïté entre villes homonymes
- **Géolocalisation** pour proposer la météo de la position courante à l'ouverture
- **Favoris persistés** en `localStorage`, avec un tableau de bord multi-villes
- **Cache persistant** entre les rechargements de page (actuellement le cache est en mémoire et
  se vide à chaque `F5`)
- **Graphique d'évolution** des températures sur les 5 jours
- **Tests supplémentaires** : tests de composants et tests end-to-end, là où seule la couche
  service est couverte aujourd'hui
- **Accessibilité** : audit complet du contraste et de la navigation au clavier
