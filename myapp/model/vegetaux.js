const db = require('./connexion'); // Assurez-vous que ce chemin est correct

module.exports = {
    create: function(vegetal) {
        return new Promise((resolve, reject) => {
            const { id, type, sol, temp_min, temp_max, plantation } = vegetal;
            const query = "INSERT INTO Vegetaux (id, type, sol, temp_min, temp_max, plantation) VALUES ($1, $2, $3, $4, $5, $6)";
            db.query(query, [id, quantite, taille, typeSol, type, jardin_id], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la création du végétal :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    },

    read: function() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Vegetaux";
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Erreur lors de la lecture des végétaux :", err);
                    reject(err);
                } else {
                    console.log("test si fonction est lancée")
                    resolve(results.rows);
                }
            });
        });
    },

    delete: function(vegetalId) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM Vegetaux WHERE id = $1";
            db.query(query, [vegetalId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la suppression du végétal :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    },

    

getTemp_min: function(vegetalId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT temp_min FROM Vegetaux WHERE id = $1";
        db.query(query, [vegetalId], (err, result) => {
            if (err) {
                console.error("Erreur lors de la récupération de la température minimale :", err);
                reject(err);
            } else if (result.rows.length === 0) {
                resolve(null); // Aucune température trouvée
            } else {
                resolve(result.rows[0].temp_min); // Retourne la température minimale
            }
        });
    });
},

getTemp_max: function(vegetalId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT temp_max FROM Vegetaux WHERE id = $1";
        db.query(query, [vegetalId], (err, result) => {
            if (err) {
                console.error("Erreur lors de la récupération de la température maximale :", err);
                reject(err);
            } else if (result.rows.length === 0) {
                resolve(null); // Aucune température trouvée
            } else {
                resolve(result.rows[0].temp_max); // Retourne la température maximale
            }
        });
    });
},

getTemp_min_nuit: function(vegetalId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT temp_min_nuit FROM Vegetaux WHERE id = $1";
        db.query(query, [vegetalId], (err, result) => {
            if (err) {
                console.error("Erreur lors de la récupération de la température maximale :", err);
                reject(err);
            } else if (result.rows.length === 0) {
                resolve(null); // Aucune température trouvée
            } else {
                resolve(result.rows[0].temp_min_nuit); // Retourne la température maximale
            }
        });
    });
},

getTemp_max_nuit: function(vegetalId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT temp_max_nuit FROM Vegetaux WHERE id = $1";
        db.query(query, [vegetalId], (err, result) => {
            if (err) {
                console.error("Erreur lors de la récupération de la température maximale :", err);
                reject(err);
            } else if (result.rows.length === 0) {
                resolve(null); // Aucune température trouvée
            } else {
                resolve(result.rows[0].temp_max_nuit); // Retourne la température maximale
            }
        });
    });
}

};