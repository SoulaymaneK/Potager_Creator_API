const db = require('./connexion'); // Assurez-vous que ce chemin est correct

module.exports = {
    create: function(meteo) {
        return new Promise((resolve, reject) => {
            const { id, jour, temperature, soleil, vegetaux_id } = meteo;
            const query = "INSERT INTO Meteo (id, jour, temperature, soleil, vegetaux_id) VALUES ($1, $2, $3, $4, $5)";
            db.query(query, [id, jour, temperature, soleil, vegetaux_id], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la création de la météo :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    },

    read: function() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Meteo";
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Erreur lors de la lecture de la météo :", err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },

    delete: function(meteoId) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM Meteo WHERE id = $1";
            db.query(query, [meteoId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la suppression de la météo :", err);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    }
};
