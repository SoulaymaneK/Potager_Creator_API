-- Insertion des utilisateurs avec auto-incrémentation des IDs
INSERT INTO Utilisateur (nom, prenom, mail, mdp, date_crea) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'password123', '2023-01-01'),
('Martin', 'Sophie', 'sophie.martin@example.com', 'password456', '2023-02-15'),
('Bernard', 'Paul', 'paul.bernard@example.com', 'password789', '2023-03-10');

-- Insertion des admins avec spécification des IDs
INSERT INTO Admin (id_user, date_crea) VALUES
((SELECT id FROM Utilisateur WHERE mail = 'jean.dupont@example.com'), '2023-01-01'),
((SELECT id FROM Utilisateur WHERE mail = 'sophie.martin@example.com'), '2023-02-15');

-- Insertion des jardins avec spécification des IDs
INSERT INTO Jardin (id, taille, localisation, utilisateur_id) VALUES
(1, 150, '123 Rue des Fleurs, Paris', (SELECT id FROM Utilisateur WHERE mail = 'jean.dupont@example.com')),
(2, 200, '456 Avenue des Plantes, Lyon', (SELECT id FROM Utilisateur WHERE mail = 'sophie.martin@example.com')),
(3, 100, '789 Boulevard des Arbres, Marseille', (SELECT id FROM Utilisateur WHERE mail = 'paul.bernard@example.com'));

-- Insertion des végétaux avec spécification des IDs
INSERT INTO Vegetaux (id, quantite, taille, typeSol, type, jardin_id) VALUES
(1, 10, 30, 'Argile', 'Tomates', 1),
(2, 15, 50, 'Sable', 'Carottes', 1),
(3, 20, 25, 'Loam', 'Laitues', 2),
(4, 5, 40, 'Argile', 'Pommes de Terre', 3);

-- Insertion des conditions météorologiques avec spécification des IDs
INSERT INTO Meteo (id, jour, temperature, soleil, vegetaux_id) VALUES
(1, '2023-04-01', 15, TRUE, 1),
(2, '2023-04-02', 16, FALSE, 1),
(3, '2023-04-03', 18, TRUE, 2),
(4, '2023-04-01', 20, TRUE, 3),
(5, '2023-04-04', 22, TRUE, 4);
