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
INSERT INTO race (libelle, puGg, pvGg, prixAtody) VALUES
('Rhode Island Red',   2.5,  4.0,  500),
('Sussex',             2.0,  3.5,  450),
('Leghorn',            1.8,  3.0,  400),
('Plymouth Rock',      2.2,  3.8,  480),
('Gasy',               1.5,  2.5,  300);
GO

INSERT INTO confSakafo (age, idRace, variationPoid, sakafoG) VALUES
-- Rhode Island Red (id=1)
(0,  1, 150, 0),
(1,  1, 30,  60),
(2,  1, 40,  70),
(3,  1, 35,  80),
(4,  1, 30,  90),
(5,  1, 25,  95),
(6,  1, 20,  100),
(7,  1, 15,  90),
(8,  1, 10,  80),
(9,  1, 5,   60),
(10, 1, 0,   0),
-- Sussex (id=2)
(0,  2, 120, 0),
(1,  2, 25,  50),
(2,  2, 35,  60),
(3,  2, 30,  70),
(4,  2, 25,  80),
(5,  2, 20,  85),
(6,  2, 15,  90),
(7,  2, 12,  80),
(8,  2, 8,   70),
(9,  2, 4,   50),
(10, 2, 0,   0),
-- Leghorn (id=3)
(0,  3, 100, 0),
(1,  3, 20,  45),
(2,  3, 30,  55),
(3,  3, 25,  65),
(4,  3, 20,  75),
(5,  3, 18,  80),
(6,  3, 14,  85),
(7,  3, 10,  75),
(8,  3, 7,   65),
(9,  3, 3,   45),
(10, 3, 0,   0),
-- Plymouth Rock (id=4)
(0,  4, 130, 0),
(1,  4, 28,  55),
(2,  4, 38,  65),
(3,  4, 32,  75),
(4,  4, 28,  85),
(5,  4, 22,  90),
(6,  4, 18,  95),
(7,  4, 13,  85),
(8,  4, 9,   75),
(9,  4, 4,   55),
(10, 4, 0,   0),
-- Gasy (id=5)
(0,  5, 80,  0),
(1,  5, 15,  40),
(2,  5, 25,  50),
(3,  5, 20,  60),
(4,  5, 18,  70),
(5,  5, 14,  75),
(6,  5, 10,  70),
(7,  5, 8,   60),
(8,  5, 5,   50),
(9,  5, 2,   35),
(10, 5, 0,   0);
GO

-- Données de test : lot
INSERT INTO lot (idRace, nb, age, date, PU) VALUES
(1, 100, 2, '2026-02-01', 760),
(2, 150, 3, '2026-01-25', 630),
(3,  80, 1, '2026-02-15', 360),
(4, 200, 4, '2026-01-15', 836),
(5, 120, 5, '2026-01-10', 395),
(4,  30, 0, '2026-03-01', 0);
GO

-- Données de test : lotMaty
INSERT INTO lotMaty (idLot, nbMaty, date) VALUES
(1,  5, '2026-02-10'),
(1,  3, '2026-02-20'),
(2, 10, '2026-02-05'),
(4,  8, '2026-02-01'),
(4,  4, '2026-02-15'),
(5,  6, '2026-01-25');
GO

-- Données de test : lotAtody
INSERT INTO lotAtody (idLot, nbAtody, date) VALUES
(1,  50, '2026-02-15'),
(2,  80, '2026-02-10'),
(2,  60, '2026-02-25'),
(4,  70, '2026-02-05'),
(5,  70, '2026-01-30'),
(5,  45, '2026-02-20');
GO

-- Données de test : incubation
INSERT INTO incubation (idLotAtody, nbAtodyF, date) VALUES
(4, 30, '2026-03-01');
GO

PRINT 'Restauration terminée avec succès.';
GO
