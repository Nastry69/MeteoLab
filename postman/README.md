# Collection Postman — MeteoLab

## Import

1. Ouvrir Postman
2. Import → sélectionner `Weather_App.postman_collection.json`
3. Dans la collection **Weather App**, renseigner la variable `api_key` avec votre clé OpenWeather
4. (Optionnel) modifier `city` pour tester une autre ville

Ne jamais committer une vraie clé API.

## Contenu

| Dossier | Requêtes |
| --- | --- |
| Current Weather | Paris, Lille, Tokyo, ville dynamique |
| Forecast | Prévisions 5 jours (Paris + variable) |
| Tests | Ville inexistante (404), clé invalide (401) |

## Variables

- `base_url` : `https://api.openweathermap.org/data/2.5`
- `api_key` : clé OpenWeather
- `city` : ville utilisée par les requêtes dynamiques

## Lien avec l'application

Les messages d'erreur gérés côté Angular correspondent aux cas testés ici :

- formulaire vide → `Veuillez saisir une ville.`
- 404 → `Ville introuvable.`
- 429 → `Trop de requêtes, veuillez réessayer dans quelques instants.`
- autre erreur API → `Impossible de récupérer les données météo.`
