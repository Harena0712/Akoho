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
        id       INT IDENTITY(1,1) PRIMARY KEY,
        libelle  VARCHAR(100) NOT NULL,
        puGg     FLOAT NOT NULL,       -- prix unitaire par gramme (sakafoG)
        pvGg     FLOAT NOT NULL,       -- prix vente par gramme (poids de la poule)
        prixAtody FLOAT NOT NULL       -- prix d'un oeuf
    );
END
GO

-- ── Table lot ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'lot')
BEGIN
    CREATE TABLE lot (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        idRace      INT NOT NULL,
        nb          INT NOT NULL,          -- nombre de poules
        age         INT NOT NULL,          -- age en semaines
        date        DATE NOT NULL,
        PU          FLOAT NOT NULL DEFAULT 0,  -- prix unitaire d'achat (0 = issu d'éclosion)
        FOREIGN KEY (idRace) REFERENCES race(id)
    );
END
GO

-- ── Table lotMaty (poules mortes) ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'lotMaty')
BEGIN
    CREATE TABLE lotMaty (
        id      INT IDENTITY(1,1) PRIMARY KEY,
        idLot   INT NOT NULL,
        nbMaty  INT NOT NULL,          -- nombre de poules mortes
        date    DATE NOT NULL,
        FOREIGN KEY (idLot) REFERENCES lot(id)
    );
END
GO

-- ── Table lotAtody (oeufs recoltés) ──
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'lotAtody')
BEGIN
    CREATE TABLE lotAtody (
        id       INT IDENTITY(1,1) PRIMARY KEY,
        idLot    INT NOT NULL,
        nbAtody  INT NOT NULL,         -- nombre d'oeufs
        date     DATE NOT NULL,
        FOREIGN KEY (idLot) REFERENCES lot(id)
    );
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
