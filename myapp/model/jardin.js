const db = require('./connexion'); // Assurez-vous que ce chemin est correct

module.exports = {
    create: function(jardin) {
        return new Promise((resolve, reject) => {
            const { nom, taille, localisation, utilisateur_id } = jardin;  // Ajout de `nom`
            const query = "INSERT INTO Jardin (nom, taille, localisation, utilisateur_id) VALUES ($1, $2, $3, $4)";
            db.query(query, [nom, taille, localisation, utilisateur_id], (err, result) => {  // Utilisation de `nom`
                if (err) {
                    console.error("Erreur lors de la création du jardin :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    },
    

    read: function() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Jardin";
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Erreur lors de la lecture des jardins :", err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },

    readFromUser: function(IdUser) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Jardin WHERE utilisateur_id = $1";
            db.query(query, [IdUser], (err, results) => {
                if (err) {
                    console.error("Erreur lors de la lecture des jardins :", err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },
    

    delete: function(jardinId) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM Jardin WHERE id = $1";
            db.query(query, [jardinId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la suppression du jardin :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    },

    getAdresseById: function(jardinId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT localisation FROM jardin WHERE id = $1"; 
            db.query(query, [jardinId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la récupération de l'adresse du jardin :", err);
                    reject(err);
                } else if (result.rows.length === 0) {
                    resolve(null); // Aucune adresse trouvée
                } else {
                    resolve(result.rows[0].localisation); // Retourne l'adresse du jardin
                }
            });
        });
    },

    readById: function(jardinId) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Jardin WHERE id = $1";
            db.query(query, [jardinId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la récupération du jardin par ID :", err);
                    reject(err);
                } else if (result.rows.length === 0) {
                    resolve(null); // Aucun jardin trouvé
                } else {
                    resolve(result.rows[0]); // Retourne le jardin correspondant
                }
            });
        });
    },

    // Fonction update pour modifier un jardin
update: function(jardin) {
    return new Promise((resolve, reject) => {
        const { id, nom, taille, localisation } = jardin;
        const query = `
            UPDATE Jardin 
            SET nom = $1, taille = $2, localisation = $3 
            WHERE id = $4
        `;
        db.query(query, [nom, taille, localisation, id], (err, result) => {
            if (err) {
                console.error("Erreur lors de la mise à jour du jardin :", err);
                reject(err);
            } else {
                resolve(result.rowCount); // Nombre de lignes affectées
            }
        });
    });
},
// Fonction update pour modifier un jardin
update: function(jardin) {
    return new Promise((resolve, reject) => {
        const { id, nom, taille, localisation } = jardin;
        const query = `
            UPDATE Jardin 
            SET nom = $1, taille = $2, localisation = $3 
            WHERE id = $4
        `;
        db.query(query, [nom, taille, localisation, id], (err, result) => {
            if (err) {
                console.error("Erreur lors de la mise à jour du jardin :", err);
                reject(err);
            } else {
                resolve(result.rowCount); // Nombre de lignes affectées
            }
        });
    });
},


    getAllInfoJardin: function(idJardin) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    v.type AS nom_vegetal, 
                    cj.quantite, 
                    cj.prevision_plantation,
                    cj.vegetal 
                FROM 
                    compo_jardin cj 
                JOIN 
                    Vegetaux v ON cj.vegetal = v.id 
                WHERE 
                    cj.jardin = $1
            `;
    
            db.query(query, [idJardin], (err, results) => {
                if (err) {
                    console.error("Erreur lors de la récupération des informations du jardin :", err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            });
        });
    }
};
