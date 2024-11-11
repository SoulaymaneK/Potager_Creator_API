var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../model/user.js');
const JardinModel = require('../model/jardin.js');
const AdminModel = require('../model/admin.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/userslist', function (req, res, next) {
  userModel.read()
    .then(result => {
      res.render('userslist', { title: 'Liste des utilisateurs', users: result });
    })
    .catch(err => {
      console.error("Erreur lors de la lecture des utilisateurs :", err);
      res.status(500).send("Erreur lors de la lecture des utilisateurs");
    });
});

/* GET home page. */
router.get('/accueil', function(req, res, next) {
    if (req.session && req.session.user) {
        JardinModel.readFromUser(req.session.user.id)
            .then(jardins => {
                res.render('accueil', { user: req.session.user, jardins: jardins });
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des jardins :", error);
                res.render('accueil', { user: req.session.user, jardins: [], error: 'Une erreur s\'est produite lors de la récupération des jardins.' });
            });
    } else {
        res.redirect('/connexion');
    }
});

router.post('/connexion', function(req, res, next) {
    const { mail, password } = req.body;

    // Look up the user by email
    userModel.exist(mail, password)
    .then(user => {
        if (user) {
            // bcrypt comparison handled in the `exist` method
            req.session.user = {
                id: user.id,
                name: user.nom,
                email: user.mail
            };
            return JardinModel.readFromUser(user.id);
        } else {
            console.error('Erreur : Email ou mot de passe incorrect');
            res.render('index', { error: 'Email ou mot de passe incorrect' });
        }
    })
    .then(jardins => {
        if (jardins) {
            // Render accueil with user and gardens info
            res.render('accueil', { user: req.session.user, jardins: jardins });
        }
    })
    .catch(error => {
        console.error('Erreur lors de la connexion :', error);
        res.render('index', { error: 'Une erreur s\'est produite, veuillez réessayer.' });
    });
});

router.post('/inscription', function(req, res, next) {
    const { Prenom, Nom, newEmail, Telephone, newPassword, confirmPassword } = req.body;

    // Vérifier si les mots de passe correspondent
    if (newPassword !== confirmPassword) {
        return res.status(400).send("Les mots de passe ne correspondent pas.");
    }

    // Vérification des critères du mot de passe côté serveur
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordPattern.test(newPassword)) {
        return res.status(400).send("Le mot de passe doit respecter les critères de sécurité.");
    }

    // Vérification si l'email est déjà utilisé
    userModel.isValid(newEmail)
        .then(isValidEmail => {
            if (isValidEmail) {
                throw new Error("Cet e-mail est déjà utilisé.");
            } else {
                // Hash the password before saving it in the database
                return bcrypt.hash(newPassword, 10); // 10 is the salt rounds
            }
        })
        .then(hashedPassword => {
            // Create a new user with the hashed password
            return userModel.create(Nom, Prenom, newEmail, hashedPassword, Telephone);
        })
        .then(userId => {
            // Store user info in the session
            req.session.user = {
                id: userId,
                name: Nom,
                email: newEmail
            };
            // Redirect to the home page
            res.redirect('/accueil');
        })
        .catch(err => {
            // Handle errors and send a proper response
            console.error("Erreur lors de l'inscription :", err.message);
            res.status(500).render('error', { error: err.message });
        });
});

// Route for logout
router.get('/deconnexion', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

router.post('/connexionAdmin', function(req, res, next) {
    const { mail, password } = req.body;

    // Affichage des données reçues depuis le formulaire
    console.log("Tentative de connexion admin avec :", { mail, password });

    // Check if the user is an admin
    AdminModel.existAdmin(mail, password)
        .then(admin => {
            if (admin) {
                // Admin authenticated, set session data
                req.session.admin = {
                    id: admin.id,
                    name: admin.nom,
                    email: admin.mail
                };

                // Affichage des informations de l'admin en session
                console.log("Connexion admin réussie. Informations de l'admin :", req.session.admin);

                // Redirection vers la page d'administration
                res.redirect('/admin');
            } else {
                // Authentication failed
                console.error('Erreur : Email ou mot de passe admin incorrect');

                // Rendre la page d'accueil avec un message d'erreur
                res.render('index', { error: 'Email ou mot de passe admin incorrect' });
            }
        })
        .catch(error => {
            // Affiche une erreur s'il y a eu un problème lors de la requête à la base de données
            console.error('Erreur lors de la connexion admin :', error);

            // Affiche un message d'erreur sur la page d'accueil
            res.render('index', { error: 'Une erreur s\'est produite, veuillez réessayer.' });
        });
});

module.exports = router;
