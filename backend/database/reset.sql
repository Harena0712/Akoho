-- sqlcmd -S localhost -U sa -P Harena0712 -d AkohoDB -i /home/harena/Documents/ITU/S4/Programmation/Akoho/backend/database/reset.sql

USE AkohoDB;
GO

-- ====================================
-- Script de restauration / réinitialisation
-- Efface toutes les données et remet les ID à 0
-- ====================================

-- Suppression dans l'ordre (respecter les foreign keys)
DROP TABLE incubation;
DROP TABLE lotAtody;
DROP TABLE lotMaty;
DROP TABLE lot;
DROP TABLE confSakafo;
DROP TABLE race;
GO

-- -- Réinitialisation des identités
-- DBCC CHECKIDENT ('incubation', RESEED, 0);
-- DBCC CHECKIDENT ('lotAtody', RESEED, 0);
-- DBCC CHECKIDENT ('lotMaty', RESEED, 0);
-- DBCC CHECKIDENT ('lot', RESEED, 0);
-- DBCC CHECKIDENT ('confSakafo', RESEED, 0);
-- DBCC CHECKIDENT ('race', RESEED, 0);
-- GO

-- Réinsertion des données de base (exemple de scénario)
-- INSERT INTO race (
--   libelle, puGg, pvGg, prixAtody,
--   capaciteOeufs, male, femelle, oeufPourri, mortMale, mortFemelle, nbJourIncubation
-- ) VALUES
-- ('borbonèze', 5.0, 15.0, 500, 40, 40, 60, 8, 60, 40, 30);
-- GO

-- INSERT INTO confSakafo (age, idRace, variationPoid, sakafoG) VALUES
-- Poids init = S0 pour la race id=1
-- (0,  1, 50,  0),
-- (1,  1, 20,  75),
-- (2,  1, 25,  80),
-- (3,  1, 30,  100),
-- (4,  1, 40,  150),
-- (5,  1, 80,  170),
-- (6,  1, 85,  190),
-- (7,  1, 100, 200),
-- (8,  1, 100, 250),
-- (9,  1, 90,  270),
-- (10, 1, 140, 290),
-- (11, 1, 200, 300),
-- (12, 1, 220, 370),
-- (13, 1, 265, 390),
-- (14, 1, 285, 350),
-- (15, 1, 300, 300),
-- (16, 1, 350, 450),
-- (17, 1, 400, 500),
-- (18, 1, 420, 400),
-- (19, 1, 430, 500),
-- (20, 1, 500, 500),
-- (21, 1, 530, 650),
-- (22, 1, 600, 600),
-- (23, 1, 400, 750),
-- (24, 1, 100, 750),
-- (25, 1, 0,   600);
-- GO

-- Données de test : lot
-- INSERT INTO lot (idRace, nb, nbMale, nbFemelle, age, date, PU) VALUES
-- (1, 500, 200, 300, 0, '2026-01-01', 500),
-- (1, 320, 128, 192, 3, '2025-12-20', 520);
-- GO

-- Données de test : lotMaty
-- INSERT INTO lotMaty (idLot, nbMaty, nbMale, nbFemelle, date) VALUES
-- (1, 15, 9, 6, '2026-02-01'),
-- (1, 12, 7, 5, '2026-02-18'),
-- (2, 9, 5, 4, '2026-01-25');
-- GO

-- Données de test : lotAtody
-- INSERT INTO lotAtody (idLot, nbAtody, date) VALUES
-- (1, 100, '2026-02-02'),
-- (1, 150, '2026-02-15'),
-- (2, 80,  '2026-01-30');
-- GO

-- Données de test : incubation
-- Laisser vide pour valider processByDate auto
-- GO

-- PRINT 'Restauration terminée avec succès.';
-- GO
