const db = require('./connexion.js');
const bcrypt = require('bcrypt');

module.exports = {

    createAdmin: function(id) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO public.admin (id_user, date_crea) VALUES ($1, CURRENT_DATE)"; // Utilise CURRENT_DATE pour la date de création
           // console.log(`Tentative de création d'un admin avec l'ID utilisateur : ${id}`); // Message de débogage
            
            db.query(sql, [id], function(err, result) {
                if (err) {
                    console.error("Erreur lors de la création de l'admin :", err.code, err.sqlMessage); // Log error
                    reject(err); // Rejeter la promesse en cas d'erreur
                } else {
                   // console.log(`Admin créé avec succès. Lignes affectées : ${result.rowCount}`); // Log success
                    resolve(result.rowCount); // Résoudre la promesse avec le nombre de lignes affectées
                }
            });
        });
    },
    

    readall: function() {
        return new Promise((resolve, reject) => {
            var sql = "SELECT * FROM Administrateur";
            db.query(sql, function(err, result) {
                if (err) {
                  console.error("Error reading all admins:", err); // Log error
                  reject(err); // Rejeter la promesse en cas d'erreur
                } else {
                  console.log("Admins read:", result); // Log success
                  resolve(result); // Résoudre la promesse avec le résultat
                }
            });
        });
    },

    isAdmin: function(user) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM admin WHERE id_user = $1";    
            db.query(sql, [user], (err, result) => {
                if (err) {
                    // En cas d'erreur, on affiche l'erreur et on la rejette
                    console.error("Erreur lors de la vérification du statut d'administrateur :", err);
                    reject(err);
                } else {
                    
                    // Vérification du nombre de résultats renvoyés
                    if (result.rowCount === 1) {
                        // L'utilisateur est un administrateur
                        console.log("L'utilisateur avec l'ID", user, "est un administrateur.");
                        resolve(true);
                    } else {
                        // L'utilisateur n'est pas un administrateur
                        console.log("L'utilisateur avec l'ID", user, "n'est pas un administrateur.");
                        resolve(false);
                    }
                }
            });
        });
    },
    

    existAdmin: function(mail, password) {
        return new Promise((resolve, reject) => {
            const userSql = "SELECT id, nom, mail, mdp FROM utilisateur WHERE mail = $1";
            db.query(userSql, [mail], (err, result) => {
                if (err) {
                    console.log(db.query);
                    console.error("Database error:", err);
                    reject(err);
                } else {
                    if (result.rowCount === 1) {
                        const hashedPassword = result.rows[0].mdp;
                        // Compare passwords using bcrypt
                        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                            if (err) {
                                console.error("bcrypt error:", err);
                                reject(err);
                            } else if (isMatch) {
                                const userId = result.rows[0].id;
                                // Now check if the user is an admin
                                const adminSql = "SELECT * FROM admin WHERE id_user = $1";
                                db.query(adminSql, [userId], (adminErr, adminResult) => {
                                    if (adminErr) {
                                        console.error("Admin check error:", adminErr);
                                        reject(adminErr);
                                    } else if (adminResult.rowCount === 1) {
                                        // User is an admin
                                        resolve({
                                            id: result.rows[0].id,
                                            nom: result.rows[0].nom,
                                            mail: result.rows[0].mail
                                        });
                                    } else {
                                        // User is not an admin
                                        resolve(null);
                                    }
                                });
                            } else {
                                // Password doesn't match
                                resolve(null);
                            }
                        });
                    } else {
                        // No user found with that email
                        resolve(null);
                    }
                }
            });
        });
    },
    

    deleteAdmin: function(id) {
        return new Promise((resolve, reject) => {
           // console.log(`Tentative de suppression de l'admin avec l'ID utilisateur : ${id}`); // Message de débogage
    
            const sql = "DELETE FROM public.admin WHERE id_user = $1"; // Utilise le paramètre $1
           // console.log(`Requête SQL exécutée : ${sql} avec ID : ${id}`); // Affiche la requête SQL
    
            db.query(sql, [id], function(err, result) {
                if (err) {
                  //  console.error("Erreur lors de la suppression de l'admin :", err.code, err.sqlMessage); // Log error
                    reject(err); // Rejeter la promesse en cas d'erreur
                } else {
                    if (result.rowCount > 0) {
                       // console.log(`Admin supprimé avec succès. Lignes affectées : ${result.rowCount}`); // Log success
                    } else {
                    }
                    resolve(result.rowCount); // Résoudre la promesse avec le nombre de lignes affectées
                }
            });
        });
    }
    

};
