-- sqlcmd -S localhost -U sa -P Harena0712 -d AkohoDB -i /home/harena/Documents/ITU/S4/Programmation/Akoho/backend/database/data.sql

USE AkohoDB;
GO

-- ====================================
-- Données de base : race
-- ====================================
-- Suppression des anciennes données si besoin de réinitialiser
-- DELETE FROM confSakafo; DELETE FROM race;

IF NOT EXISTS (SELECT 1 FROM race)
BEGIN
    INSERT INTO race (
        libelle, puGg, pvGg, prixAtody,
        capaciteOeufs, male, femelle, oeufPourri, mortMale, mortFemelle, nbJourIncubation
    ) VALUES
    ('borbonèze', 5, 15, 500, 40, 40, 60, 8, 60, 40, 30);
END
GO

-- ====================================
-- Données de base : confSakafo
-- ====================================
IF NOT EXISTS (SELECT 1 FROM confSakafo)
BEGIN
    -- Poids init = S0
    -- Les valeurs suivantes reprennent S1 a S25
    INSERT INTO confSakafo (age, idRace, variationPoid, sakafoG) VALUES
    (0,  1, 50,  0),
    (1,  1, 20,  75),
    (2,  1, 25,  80),
    (3,  1, 30,  100),
    (4,  1, 40,  150),
    (5,  1, 80,  170),
    (6,  1, 85,  190),
    (7,  1, 100, 200),
    (8,  1, 100, 250),
    (9,  1, 90,  270),
    (10, 1, 140, 290),
    (11, 1, 200, 300),
    (12, 1, 220, 370),
    (13, 1, 265, 390),
    (14, 1, 285, 350),
    (15, 1, 300, 300),
    (16, 1, 350, 450),
    (17, 1, 400, 500),
    (18, 1, 420, 400),
    (19, 1, 430, 500),
    (20, 1, 500, 500),
    (21, 1, 530, 650),
    (22, 1, 600, 600),
    (23, 1, 400, 750),
    (24, 1, 100, 750),
    (25, 1, 0,   600);
END
GO

-- ====================================
-- Données de test : lot
-- ====================================
IF NOT EXISTS (SELECT 1 FROM lot)
BEGIN
    INSERT INTO lot (idRace, nb, nbMale, nbFemelle, age, date, PU) VALUES
    (1, 500, 0, 500, 0, '2026-01-01', 500);
END
GO

-- ====================================
-- Données de test : lotMaty
-- ====================================
IF NOT EXISTS (SELECT 1 FROM lotMaty)
BEGIN
    INSERT INTO lotMaty (idLot, nbMaty, nbMale, nbFemelle, date) VALUES
    (1, 15, 9, 6, '2026-02-01');
END
GO

-- ====================================
-- Données de test : lotAtody
-- ====================================
IF NOT EXISTS (SELECT 1 FROM lotAtody)
BEGIN
    INSERT INTO lotAtody (idLot, nbAtody, date) VALUES
    (1,  100, '2026-02-02'),
    (1,  150, '2026-02-15');
END
GO

-- ====================================
-- Données de test : incubation
-- ====================================
IF NOT EXISTS (SELECT 1 FROM incubation)
BEGIN
    PRINT 'Incubation seed ignoree (test processByDate automatique).';
END
GO
