-- sqlcmd -S localhost -U sa -P Harena0712 -d AkohoDB -i /home/harena/Documents/ITU/S4/Programmation/Akoho/backend/database/reset.sql

USE AkohoDB;
GO

-- ====================================
-- Script de restauration / réinitialisation
-- Efface toutes les données et remet les ID à 0
-- ====================================

-- Suppression dans l'ordre (respecter les foreign keys)
DELETE FROM incubation;
DELETE FROM lotAtody;
DELETE FROM lotMaty;
DELETE FROM lot;
DELETE FROM confSakafo;
DELETE FROM race;
GO

-- Réinitialisation des identités
DBCC CHECKIDENT ('incubation', RESEED, 0);
DBCC CHECKIDENT ('lotAtody', RESEED, 0);
DBCC CHECKIDENT ('lotMaty', RESEED, 0);
DBCC CHECKIDENT ('lot', RESEED, 0);
DBCC CHECKIDENT ('confSakafo', RESEED, 0);
DBCC CHECKIDENT ('race', RESEED, 0);
GO

-- Réinsertion des données de base
-- INSERT INTO race (libelle, puGg, pvGg, prixAtody) VALUES
-- ('borbonèze',          5.0, 15.0, 500);
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
-- INSERT INTO lot (idRace, nb, age, date, PU) VALUES
-- (1, 100, 2, '2026-02-01', 760),
-- (2, 150, 3, '2026-01-25', 630),
-- (3,  80, 1, '2026-02-15', 360),
-- (4, 200, 4, '2026-01-15', 836),
-- (5, 120, 5, '2026-01-10', 395),
-- (4,  30, 0, '2026-03-01', 0);
-- GO

-- Données de test : lotMaty
-- INSERT INTO lotMaty (idLot, nbMaty, date) VALUES
-- (1,  5, '2026-02-10'),
-- (1,  3, '2026-02-20'),
-- (2, 10, '2026-02-05'),
-- (4,  8, '2026-02-01'),
-- (4,  4, '2026-02-15'),
-- (5,  6, '2026-01-25');
-- GO

-- Données de test : lotAtody
-- INSERT INTO lotAtody (idLot, nbAtody, date) VALUES
-- (1,  50, '2026-02-15'),
-- (2,  80, '2026-02-10'),
-- (2,  60, '2026-02-25'),
-- (4,  70, '2026-02-05'),
-- (5,  70, '2026-01-30'),
-- (5,  45, '2026-02-20');
-- GO

-- Données de test : incubation
-- INSERT INTO incubation (idLotAtody, nbAtodyF, date) VALUES
-- (4, 30, '2026-03-01');
-- GO

-- PRINT 'Restauration terminée avec succès.';
-- GO
