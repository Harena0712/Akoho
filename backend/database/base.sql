-- sqlcmd -S localhost -U sa -P Harena0712 -d AkohoDB -i /home/harena/Documents/ITU/S4/Programmation/Akoho/backend/database/base.sql

-- ====================================
-- Base de données Akoho
-- ====================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AkohoDB')
BEGIN
    CREATE DATABASE AkohoDB;
END
GO

USE AkohoDB;
GO

-- ── Table race ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'race')
BEGIN
    CREATE TABLE race (
        id               INT IDENTITY(1,1) PRIMARY KEY,
        libelle          VARCHAR(100) NOT NULL,
        puGg             FLOAT NOT NULL,       -- prix unitaire par gramme (sakafoG)
        pvGg             FLOAT NOT NULL,       -- prix vente par gramme (poids de la poule)
        prixAtody        FLOAT NOT NULL,       -- prix d'un oeuf
        capaciteOeufs    INT NOT NULL DEFAULT 0,
        male             INT NOT NULL DEFAULT 0,   -- pourcentage
        femelle          INT NOT NULL DEFAULT 0,   -- pourcentage
        oeufPourri       INT NOT NULL DEFAULT 0,   -- pourcentage
        mortMale         INT NOT NULL DEFAULT 0,   -- pourcentage
        mortFemelle      INT NOT NULL DEFAULT 0,   -- pourcentage
        nbJourIncubation INT NOT NULL DEFAULT 0
    );
END
GO

-- -- Migration: ajouter les colonnes manquantes sur race si la table existe deja
-- IF COL_LENGTH('dbo.race', 'capaciteOeufs') IS NULL
-- BEGIN
--     ALTER TABLE dbo.race ADD capaciteOeufs INT NOT NULL CONSTRAINT DF_race_capaciteOeufs DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.race', 'male') IS NULL
-- BEGIN
--     ALTER TABLE dbo.race ADD male INT NOT NULL CONSTRAINT DF_race_male DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.race', 'femelle') IS NULL
-- BEGIN
--     ALTER TABLE dbo.race ADD femelle INT NOT NULL CONSTRAINT DF_race_femelle DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.race', 'oeufPourri') IS NULL
-- BEGIN
--     ALTER TABLE dbo.race ADD oeufPourri INT NOT NULL CONSTRAINT DF_race_oeufPourri DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.race', 'mortMale') IS NULL
-- BEGIN
--     ALTER TABLE dbo.race ADD mortMale INT NOT NULL CONSTRAINT DF_race_mortMale DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.race', 'mortFemelle') IS NULL
-- BEGIN
--     ALTER TABLE dbo.race ADD mortFemelle INT NOT NULL CONSTRAINT DF_race_mortFemelle DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.race', 'nbJourIncubation') IS NULL
-- BEGIN
--     ALTER TABLE dbo.race ADD nbJourIncubation INT NOT NULL CONSTRAINT DF_race_nbJourIncubation DEFAULT (0) WITH VALUES;
-- END
-- GO

-- ── Table lot ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'lot')
BEGIN
    CREATE TABLE lot (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        idRace      INT NOT NULL,
        nb          INT NOT NULL,          -- nombre de poules
        nbMale      INT NOT NULL DEFAULT 0,
        nbFemelle   INT NOT NULL DEFAULT 0,
        age         INT NOT NULL,          -- age en semaines
        date        DATE NOT NULL,
        PU          FLOAT NOT NULL DEFAULT 0,  -- prix unitaire d'achat (0 = issu d'éclosion)
        FOREIGN KEY (idRace) REFERENCES race(id)
    );
END
GO

-- -- Migration: ajouter les colonnes manquantes sur lot si la table existe deja
-- IF COL_LENGTH('dbo.lot', 'nbMale') IS NULL
-- BEGIN
--     ALTER TABLE dbo.lot ADD nbMale INT NOT NULL CONSTRAINT DF_lot_nbMale DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.lot', 'nbFemelle') IS NULL
-- BEGIN
--     ALTER TABLE dbo.lot ADD nbFemelle INT NOT NULL CONSTRAINT DF_lot_nbFemelle DEFAULT (0) WITH VALUES;
-- END
-- GO

-- ── Table lotMaty (poules mortes) ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'lotMaty')
BEGIN
    CREATE TABLE lotMaty (
        id      INT IDENTITY(1,1) PRIMARY KEY,
        idLot   INT NOT NULL,
        nbMaty  INT NOT NULL,          -- nombre de poules mortes
        nbMale  INT NOT NULL DEFAULT 0,
        nbFemelle INT NOT NULL DEFAULT 0,
        date    DATE NOT NULL,
        FOREIGN KEY (idLot) REFERENCES lot(id)
    );
END
GO

-- -- Migration: ajouter les colonnes manquantes sur lotMaty si la table existe deja
-- IF COL_LENGTH('dbo.lotMaty', 'nbMale') IS NULL
-- BEGIN
--     ALTER TABLE dbo.lotMaty ADD nbMale INT NOT NULL CONSTRAINT DF_lotMaty_nbMale DEFAULT (0) WITH VALUES;
-- END
-- GO

-- IF COL_LENGTH('dbo.lotMaty', 'nbFemelle') IS NULL
-- BEGIN
--     ALTER TABLE dbo.lotMaty ADD nbFemelle INT NOT NULL CONSTRAINT DF_lotMaty_nbFemelle DEFAULT (0) WITH VALUES;
-- END
-- GO

-- ── Table lotAtody (oeufs recoltés) ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'lotAtody')
BEGIN
    CREATE TABLE lotAtody (
        id       INT IDENTITY(1,1) PRIMARY KEY,
        idLot    INT NOT NULL,
        nbAtody  INT NOT NULL,         -- nombre d'oeufs
        date     DATE NOT NULL,
        etat     BIT NOT NULL DEFAULT 0, -- 0 = en attente, 1 = éclos
        FOREIGN KEY (idLot) REFERENCES lot(id)
    );
END
GO

-- Migration: ajouter etat sur lotAtody si la table existe déjà
IF COL_LENGTH('dbo.lotAtody', 'etat') IS NULL
BEGIN
    ALTER TABLE dbo.lotAtody ADD etat BIT NOT NULL CONSTRAINT DF_lotAtody_etat DEFAULT (0) WITH VALUES;
END
GO

-- ── Table confSakafo (configuration nourriture) ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'confSakafo')
BEGIN
    CREATE TABLE confSakafo (
        id             INT IDENTITY(1,1) PRIMARY KEY,
        age            INT NOT NULL,            -- age en semaines
        idRace         INT NOT NULL,
        variationPoid  FLOAT NOT NULL,  -- variation de poids par jour (grammes)
        sakafoG        FLOAT NOT NULL,  -- nourriture en grammes par semaine
        FOREIGN KEY (idRace) REFERENCES race(id)
    );
END
GO

-- ── Table incubation (eclosion oeufs en poule) ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'incubation')
BEGIN
    CREATE TABLE incubation (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        idLotAtody  INT NOT NULL,
        nbAtodyF    INT NOT NULL,        -- nombre oeufs eclos
        date        DATE NOT NULL,
        FOREIGN KEY (idLotAtody) REFERENCES lotAtody(id)
    );
END
GO
