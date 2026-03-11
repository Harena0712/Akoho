# Akoho — Gestion d'élevage de poules

Application Angular + Express + SQL Server (Docker).

---

## Prérequis

- **Node.js** (v18+) et **npm**
- **Docker** installé et votre utilisateur dans le groupe `docker` :
  ```bash
  sudo usermod -aG docker $USER
  ```
  Puis **déconnectez-vous et reconnectez-vous** pour appliquer. Après ça, plus besoin de `sudo` pour les commandes Docker.
- **sqlcmd** (outil CLI SQL Server) — installé avec `mssql-tools`
- **Angular CLI** :
  ```bash
  npm install -g @angular/cli
  ```

---

## Lancement du projet (étape par étape)

### Étape 1 — Démarrer le conteneur SQL Server

```bash
docker start sqlserver
```

> **Première fois ?** Si le conteneur n'existe pas encore, créez-le :
> ```bash
> docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Harena0712" \
>   -p 1433:1433 --name sqlserver \
>   -d mcr.microsoft.com/mssql/server:2022-latest
> ```

Vérifiez qu'il tourne :
```bash
docker ps
```
Vous devez voir `sqlserver` avec le statut **Up**.

### Étape 2 — Créer / initialiser la base de données

Connectez-vous à SQL Server :
```bash
sqlcmd -S localhost -U sa -P Harena0712
```

Puis exécutez les scripts SQL (depuis un autre terminal) :
```bash
# Créer les tables
sqlcmd -S localhost -U sa -P Harena0712 -i backend/database/base.sql

# Insérer les données de base
sqlcmd -S localhost -U sa -P Harena0712 -d AkohoDB -i backend/database/data.sql
```

> Cette étape n'est nécessaire que la **première fois** ou après un reset.

### Étape 3 — Installer les dépendances

```bash
# Dépendances frontend (Angular)
npm install

# Dépendances backend (Express)
cd backend
npm install
cd ..
```

### Étape 4 — Démarrer le backend (API Express)

```bash
cd backend
npm start
```

Le serveur API démarre sur **http://localhost:3000**. Vérifiez :
```bash
curl http://localhost:3000/api/health
# → {"status":"OK","message":"Akoho API is running"}
```

### Étape 5 — Démarrer le frontend (Angular)

Dans un **autre terminal** :
```bash
ng serve
```

L'application est accessible sur **http://localhost:4200**.

---

## Résumé rapide (après la première installation)

```bash
# 1. Démarrer la base de données
sudo docker start sqlserver

# 2. Démarrer le backend (terminal 1)
cd backend && npm start

# 3. Démarrer le frontend (terminal 2)
ng serve
```

Ouvrir **http://localhost:4200** dans le navigateur.

---

## Arrêter le projet

```bash
# Arrêter le conteneur SQL Server
sudo docker stop sqlserver

# Les serveurs backend et frontend : Ctrl+C dans leurs terminaux
```

---

## Dépannage

| Problème | Solution |
|---|---|
| `permission denied ... docker.sock` | Ajouter votre user au groupe docker : `sudo usermod -aG docker $USER` puis se reconnecter |
| Erreurs CORS dans le navigateur avec code d'état `(null)` | Le backend n'est pas démarré → lancer `cd backend && npm start` |
| `docker start` requires at least 1 argument | Spécifier le nom du conteneur : `docker start sqlserver` |
| Connexion refusée à SQL Server | Vérifier que le conteneur tourne : `docker ps` |
| `Cannot find module ...` dans le backend | Lancer `cd backend && npm install` |

---

## Structure du projet

```
Akoho/
├── src/                  # Frontend Angular
│   ├── app/
│   │   ├── pages/        # Pages de l'application
│   │   ├── components/   # Composants réutilisables
│   │   └── services/     # Services API
├── backend/              # API Express
│   ├── server.js         # Point d'entrée
│   ├── config/db.js      # Configuration SQL Server
│   ├── database/         # Scripts SQL (base.sql, data.sql)
│   ├── controllers/      # Logique métier
│   ├── models/           # Requêtes SQL
│   └── routes/           # Routes API
```
