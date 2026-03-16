# Carbon Footprint — Hackathon #26

## Démarrage rapide

### Option 1 — Docker (recommandé)
```bash
docker-compose up --build
```
- Frontend : http://localhost:4200
- API : http://localhost:8080
- DB : localhost:5432

### Option 2 — Local

**Backend**
```bash
cd backend
# Démarrer PostgreSQL en local ou via Docker seul :
docker run -d -p 5432:5432 -e POSTGRES_DB=carbondb -e POSTGRES_USER=carbon -e POSTGRES_PASSWORD=carbon123 postgres:15-alpine
# Lancer Spring Boot
./mvnw spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
ng serve
```

## Stack

| Couche    | Techno            |
|-----------|-------------------|
| Frontend  | Angular 17        |
| Mobile    | React Native (Expo) |
| Backend   | Spring Boot 3.2   |
| Database  | PostgreSQL 15     |
| Auth      | JWT (JJWT 0.12)   |

## API REST

| Méthode | Route            | Description                         |
|---------|------------------|-------------------------------------|
| POST    | /api/sites       | Créer un site + calculer CO₂        |
| GET     | /api/sites       | Liste tous les sites                 |
| GET     | /api/sites/{id}  | Détail d'un site                    |

## Données annexe (site Rennes Capgemini)

```json
{
  "name": "Campus Rennes Capgemini",
  "surfaceM2": 11771,
  "parkingSpots": 308,
  "energyConsumptionMwh": 1840,
  "employees": 1800,
  "workstations": 1037,
  "materials": [
    { "materialType": "CONCRETE", "quantityTons": 5000 },
    { "materialType": "STEEL",    "quantityTons": 800  },
    { "materialType": "GLASS",    "quantityTons": 200  }
  ]
}
```

## Facteurs d'émission (ADEME Base Carbone)

| Matériau   | kgCO₂e / tonne |
|------------|----------------|
| Béton      | 150            |
| Acier      | 1 850          |
| Verre      | 1 400          |
| Bois       | -1 600 (stockage) |
| Aluminium  | 8 000          |
| Électricité France | 57 kgCO₂e / MWh |
| Parking    | 900 kgCO₂e / place |
