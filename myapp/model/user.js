const db = require('./connexion'); // Assurez-vous que ce chemin est correct
const bcrypt = require('bcrypt');

module.exports = {
    read: function() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Utilisateur";
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Erreur lors de la lecture des utilisateurs :", err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            });
        });
    },

    isValid: function(mail) {
        return new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) AS count FROM Utilisateur WHERE mail = $1";
            db.query(query, [mail], (err, results) => {
                if (err) {
                    console.error("Erreur lors de la vérification de l'email :", err);
                    reject(err);
                } else {
                    const emailCount = results.rows[0].count;
                    const isValidEmail = emailCount > 0;
                    resolve(isValidEmail);
                }
            });
        });
    },

    exist: function(mail, password) {
        return new Promise((resolve, reject) => {
            // Fetch the user based on the email only, as the password is hashed
            const sql = "SELECT id, nom, mail, mdp FROM Utilisateur WHERE mail = $1";
            console.log("SQL query:", sql); // For debugging purposes
            db.query(sql, [mail], (err, result) => {
                if (err) {
                    console.error("Database error:", err); // Log database errors
                    reject(err);
                } else {
                    //console.log("Query result:", result); // Log the result of the query
                    if (result.rowCount === 1) {
                        // Get the hashed password from the result
                        const hashedPassword = result.rows[0].mdp;
                        // Compare the provided password with the hashed password
                        console.log("password :", password, "base_psw :", hashedPassword);
                        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                            if (err) {
                                console.error("bcrypt error:", err); // Log bcrypt errors
                                reject(err);
                            } else if (isMatch) {
                                // Password matches, return user info
                                resolve({
                                    id: result.rows[0].id,
                                    nom: result.rows[0].nom,
                                    mail: result.rows[0].mail
                                });
                            } else {
                                // Password does not match
                                resolve(null);
                            }
                        });
                    } else {
                        // No user found with the given email
                        resolve(null);
                    }
                }
            });
        });
    },
    
    create: function(nom, prenom, mail, mdp) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Utilisateur (nom, prenom, mail, mdp, date_crea) VALUES ($1, $2, $3, $4, NOW()) RETURNING id";
            console.log("SQL query:", sql);
            db.query(sql, [nom, prenom, mail, mdp], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la création de l'utilisateur :", err);
                    reject(err);
                } else {
                    // Récupérer l'ID de la ligne créée
                    const userId = result.rows[0].id;
                    resolve(userId);
                }
            });
        });
    },
    readIsAdmin: function() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.*, 
                       CASE 
                           WHEN a.id_user IS NOT NULL THEN true 
                           ELSE false 
                       END AS is_admin
                FROM Utilisateur u
                LEFT JOIN Admin a ON u.id = a.id_user
            `;
            db.query(query, (err, results) => {
                if (err) {
                    console.error("Erreur lors de la lecture des utilisateurs avec rôle admin :", err);
                    reject(err);
                } else {
                    resolve(results.rows);
                }
            });
        });
    }    
};
    
