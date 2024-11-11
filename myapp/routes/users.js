var express = require('express');
var router = express.Router();
const { exec } = require('child_process');
const VegetauxModel = require('../model/vegetaux.js');
const CompoJardinModel = require('../model/compo_jardin.js');
const JardinModel = require('../model/jardin.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/afficher_jardin', function(req, res, next) {
  res.send('respond with a resource');
});

// Route pour afficher le formulaire avec l'ID utilisateur
router.get('/nouveau_jardin', function(req, res, next) {
  // Vérifier si l'utilisateur est connecté et s'il a un ID dans la session
  if (req.session && req.session.user && req.session.user.id) {
      const userId = req.session.user.id;

      // Rendre la vue et passer l'ID de l'utilisateur
      res.render('newJardin', { userId: userId });
  } else {
      console.error("Utilisateur non authentifié.");
      res.status(401).send("Non autorisé. Veuillez vous connecter.");
  }
});

// Route pour afficher le formulaire avec les végétaux
router.get('/ajout_vegetaux/:idjardin', function(req, res, next) {
    const idJardin = req.params.idjardin; // Récupérer l'ID du jardin depuis les paramètres de l'URL

    // Récupérer les informations du jardin
    JardinModel.getAllInfoJardin(idJardin)
        .then(infoJardin => {
            // Récupérer les végétaux depuis la base de données
            console.log(infoJardin);
            return VegetauxModel.read().then(vegetaux => {
                // Rendre la vue et passer les végétaux, l'ID du jardin et les informations du jardin
                res.render('ajout_vegetaux', { vegetaux: vegetaux, idJardin: idJardin, infoJardin: infoJardin });
            });
        })
        .catch(err => {
            console.error("Erreur lors de l'affichage de la page :", err);
            res.status(500).send("Erreur serveur");
        });
});

// Route pour supprimer un jardin
router.get('/supprimer_jardin/:idjardin', function(req, res, next) {
    const idJardin = req.params.idjardin; // Récupérer l'ID du jardin depuis les paramètres de l'URL

    // Récupérer et supprimer le jardin
    JardinModel.delete(idJardin)
        .then(result => {
            console.log(`Jardin avec ID ${idJardin} supprimé avec succès.`);
            res.redirect('/accueil'); // Redirige vers la page d'accueil
        })
        .catch(err => {
            console.error("Erreur lors de la suppression du jardin :", err);
            res.status(500).send("Erreur serveur");
        });
});


router.post('/creer_compo_jardin', function(req, res, next) {
    const idJardin = req.body.id_jardin;
    console.log(idJardin);
    const vegetalId = req.body.vegetal_id;
    const quantite = req.body.quantite;

    // Vérification des données
    if (!idJardin || !vegetalId || !quantite) {
        console.error("Données manquantes.");
        return res.status(400).send("Données invalides.");
    }

    // Créer un objet de composition
    const compo = {
        jardin: idJardin,
        vegetal: vegetalId,
        quantite: quantite
    };

    // Vérifier si la composition existe déjà
    CompoJardinModel.exists(idJardin, vegetalId)
        .then(exists => {
            if (exists) {
                // Si la composition existe, ajouter la quantité
                return CompoJardinModel.add(compo);
            } else {
                // Sinon, créer une nouvelle composition
                return CompoJardinModel.create(compo)
                    .then(result => {
                        // Récupérer les informations nécessaires uniquement si la ligne est créée
                        return Promise.all([
                            JardinModel.getAdresseById(idJardin),
                            VegetauxModel.getTemp_min(vegetalId),
                            VegetauxModel.getTemp_max(vegetalId),
                            VegetauxModel.getTemp_min_nuit(vegetalId),
                            VegetauxModel.getTemp_max_nuit(vegetalId)
                        ])
                        .then(([adresse, tempMin, tempMax, tempMinNuit, tempMaxNuit]) => {
                            // Lancer le script Python avec les arguments
                            console.log("Adresse récupérée :", adresse);
                            const command = `python3 ../code_exemple/calcul_jour_nuit.py "${adresse}" ${tempMin} ${tempMax} ${tempMinNuit} ${tempMaxNuit}`;
                            console.log(command);
                            return new Promise((resolve, reject) => {
                                exec(command, (err, stdout, stderr) => {
                                    if (err) {
                                        console.error("Erreur lors de l'exécution du script Python :", err);
                                        reject(err);
                                    }
                                    console.log("Sortie du script Python :", stdout);
                                    const prediction = stdout.trim(); // Capture la sortie du script dans la variable "prediction"
                                    console.log("Prédiction :", prediction); // Affiche la prédiction
                                    
                                    // Insérer la prévision de plantation dans la base de données
                                    return CompoJardinModel.insertPred(idJardin, vegetalId, prediction)
                                        .then(() => {
                                            resolve(); // Résoudre la promesse après l'insertion
                                        })
                                        .catch(err => {
                                            console.error("Erreur lors de l'insertion de la prévision :", err);
                                            reject(err);
                                        });
                                });
                            });
                        });
                    });
            }
        })
        .then(() => {
            res.redirect(`/users/ajout_vegetaux/${idJardin}`); // Redirection après la création ou mise à jour
        })
        .catch(err => {
            console.error("Erreur lors de l'ajout ou de la création de la composition :", err);
            res.status(500).send("Erreur lors de la mise à jour ou de la création de la composition.");
        });
});


// Route POST pour créer un jardin
router.post('/creer_jardin', function(req, res) {
    const { userId, nom, adresse, taille } = req.body;

    // Vérification des données
    if (!userId || !nom || !adresse || !taille) {
        console.error("Données manquantes.");
        return res.status(400).send("Données invalides.");
    }

    console.log(`Création d'un jardin - Nom: ${nom}, Adresse: ${adresse}, Taille: ${taille}, Utilisateur ID: ${userId}`);

    // Créer un objet jardin
    const jardin = {
        nom: nom, // Laissez le DB gérer l'ID si auto-incrémenté
        taille: taille,
        localisation: adresse, // ou le champ qui correspond à l'adresse dans votre base de données
        utilisateur_id: userId
    };

    // Appeler la fonction de création du jardin
    JardinModel.create(jardin)
        .then(result => {
            console.log("Jardin créé avec succès :", result);
            res.redirect('/accueil'); // Rediriger vers la page des jardins
        })
        .catch(err => {
            console.error("Erreur lors de la création du jardin :", err);
            res.status(500).send("Erreur lors de la création du jardin.");
        });
});

// Route GET pour modifier un jardin
router.get('/modifier_jardin/:idjardin', function(req, res) {
    // Récupérer l'id du jardin à partir des paramètres de l'URL
    const idJardin = req.params.idjardin;

    // Utiliser readById pour obtenir les informations du jardin
    JardinModel.readById(idJardin)
        .then(jardin => {
            if (jardin) {
                // Renvoyer la vue modif_jardin.ejs avec les informations du jardin
                res.render('modif_jardin', { jardin: jardin });
            } else {
                // Si aucun jardin n'est trouvé, renvoyer une erreur 404
                res.status(404).send('Jardin non trouvé');
            }
        })
        .catch(err => {
            console.error("Erreur lors de la récupération du jardin :", err);
            res.status(500).send('Erreur serveur');
        });
});

// Route POST pour modifier un jardin
router.post('/modifier_jardin/:idjardin', function(req, res) {
    const idJardin = req.params.idjardin;
    const { nom, taille, adresse } = req.body;

    // Créer un objet jardin avec les nouvelles informations
    const jardin = {
        id: idJardin,
        nom: nom,
        taille: taille,
        localisation: adresse // Utiliser 'adresse' pour le champ localisation
    };

    // Appeler la fonction update du modèle
    JardinModel.update(jardin)
        .then(rowCount => {
            if (rowCount > 0) {
                // Rediriger vers la page de succès ou afficher un message
                res.redirect('/accueil'); // Redirige vers une page de détails du jardin, par exemple
            } else {
                res.status(404).send('Jardin non trouvé');
            }
        })
        .catch(err => {
            console.error("Erreur lors de la mise à jour du jardin :", err);
            res.status(500).send('Erreur serveur lors de la mise à jour du jardin');
        });
});


// Route POST pour supprimer un légume du jardin
router.post('/supprimer_legume_jardin', function(req, res, next) {
    const jardinId = req.body.id_jardin; // ID du jardin à partir du formulaire
    const vegetalId = req.body.vegetal_id; // ID du végétal à supprimer

    // Utilisez la méthode delete du modèle pour supprimer la composition
    CompoJardinModel.delete(jardinId, vegetalId)
        .then(() => {
            // Rediriger ou renvoyer une réponse de succès
            res.redirect(`/users/ajout_vegetaux/${jardinId}`); // Rediriger vers la page d'ajout de végétaux
        })
        .catch(err => {
            // En cas d'erreur, afficher un message d'erreur
            console.error("Erreur lors de la suppression du légume :", err);
            res.render('error', { error: "Une erreur s'est produite lors de la suppression du légume." });
        });
});


module.exports = router;

