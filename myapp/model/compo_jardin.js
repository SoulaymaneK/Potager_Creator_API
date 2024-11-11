const db = require('./connexion'); // Assurez-vous que ce chemin est correct

module.exports = {
    // Fonction pour créer une nouvelle composition
    create: function(compo) {
        return new Promise((resolve, reject) => {
            const { jardin, vegetal, quantite } = compo;

            const insertQuery = "INSERT INTO compo_jardin (jardin, vegetal, quantite) VALUES ($1, $2, $3)";
            db.query(insertQuery, [jardin, vegetal, quantite], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la création de la composition du jardin :", err);
                    reject(err);
                } else {
                    resolve({ message: "Nouvelle composition ajoutée", result: result.rows });
                }
            });
        });
    },

    // Fonction pour additionner la quantité à une composition existante
    add: function(compo) {
        return new Promise((resolve, reject) => {
            const { jardin, vegetal, quantite } = compo;

            // Vérifier si une composition avec le même jardin et végétal existe déjà
            const checkQuery = "SELECT quantite FROM compo_jardin WHERE jardin = $1 AND vegetal = $2";
            db.query(checkQuery, [jardin, vegetal], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la vérification de la composition du jardin :", err);
                    reject(err);
                } else if (result.rows.length > 0) {
                    // Si la composition existe, mettre à jour la quantité en additionnant les quantités
                    const existingQuantite = parseFloat(result.rows[0].quantite); // Convertir en nombre
                    const newQuantite = existingQuantite + parseFloat(quantite); // Additionner les quantités

                    const updateQuery = "UPDATE compo_jardin SET quantite = $1 WHERE jardin = $2 AND vegetal = $3";
                    db.query(updateQuery, [newQuantite, jardin, vegetal], (err, result) => {
                        if (err) {
                            console.error("Erreur lors de la mise à jour de la composition du jardin :", err);
                            reject(err);
                        } else {
                            resolve({ message: "Quantité mise à jour", newQuantite });
                        }
                    });
                } else {
                    reject(new Error("Aucune composition existante à mettre à jour."));
                }
            });
        });
    },

    // Fonction pour vérifier si une composition existe
    exists: function(idJardin, idVegetal) {
        return new Promise((resolve, reject) => {
            const checkQuery = "SELECT 1 FROM compo_jardin WHERE jardin = $1 AND vegetal = $2";
            db.query(checkQuery, [idJardin, idVegetal], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la vérification de l'existence de la composition :", err);
                    reject(err);
                } else {
                    // Renvoie true si une ligne existe, sinon false
                    resolve(result.rows.length > 0);
                }
            });
        });
    },
    
    

    // Lecture de toutes les entrées de compo_jardin
    read: function() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM compo_jardin";
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Erreur lors de la lecture des compositions de jardin :", err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },

    // Suppression d'une composition dans le jardin (par id de jardin et de vegetal)
    delete: function(jardinId, vegetalId) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM compo_jardin WHERE jardin = $1 AND vegetal = $2";
            db.query(query, [jardinId, vegetalId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la suppression de la composition du jardin :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    },

    // Mise à jour de la quantité d'un végétal dans un jardin
    update: function(jardinId, vegetalId, newQuantite) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE compo_jardin SET quantite = $1 WHERE jardin = $2 AND vegetal = $3";
            db.query(query, [newQuantite, jardinId, vegetalId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la mise à jour de la quantité :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    },

        // Nouvelle fonction pour insérer une prévision de plantation
    insertPred: function(idJardin, idVegetal, prediction) {
        return new Promise((resolve, reject) => {
            const insertQuery = "UPDATE compo_jardin SET prevision_plantation = $1 WHERE jardin = $2 AND vegetal = $3";
            db.query(insertQuery, [prediction, idJardin, idVegetal], (err, result) => {
                if (err) {
                    console.error("Erreur lors de l'insertion de la prévision de plantation :", err);
                    reject(err);
                } else {
                    resolve({ message: "Prévision de plantation mise à jour", result: result.rows });
                }
            });
        });
    }
};
