CREATE TABLE Utilisateur (
  id INT PRIMARY KEY,
  nom VARCHAR(255),
  prenom VARCHAR(255),
  mail VARCHAR(255),
  mdp VARCHAR(255),
  date_crea DATE
);

CREATE TABLE Admin (
  id_user INT PRIMARY KEY,
  date_crea DATE,
  FOREIGN KEY (id_user) REFERENCES Utilisateur(id)
);

CREATE TABLE Jardin (
  id INT PRIMARY KEY,
  taille INT,
  localisation VARCHAR(255),
  utilisateur_id INT,
  FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);

CREATE TABLE Vegetaux (
  id INT PRIMARY KEY,
  quantite INT,
  taille INT,
  typeSol VARCHAR(255),
  type VARCHAR(255),
  jardin_id INT,
  FOREIGN KEY (jardin_id) REFERENCES Jardin(id)
);

CREATE TABLE Meteo (
  id INT PRIMARY KEY,
  jour DATE,
  temperature INT,
  soleil BOOLEAN,
  vegetaux_id INT,
  FOREIGN KEY (vegetaux_id) REFERENCES Vegetaux(id)
);
