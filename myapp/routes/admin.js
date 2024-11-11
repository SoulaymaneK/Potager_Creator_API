const express = require('express');
const router = express.Router();
const userModel = require('../model/user.js'); // recuperer les utilisateurs
const adminModel = require('../model/admin.js');
const jardinModel = require('../model/jardin.js');
const vegetauxModel = require('../model/vegetaux.js');
const compoJardinModel = require('../model/compo_jardin.js');
const { exec } = require('child_process');



// Middleware pour vérifier si l'utilisateur est un administrateur
function checkAdmin(req, res, next) {
  // Vérifie si l'utilisateur est authentifié
  console.log("check admin");
  if (!req.session.admin) {
    console.log("check admin2");
    res.redirect('/'); // Redirigez l'utilisateur vers la page de connexion s'il n'est pas connecté
  } else {
    console.log(req.session.admin.id);
    // Vérifie si l'utilisateur est un administrateur
    adminModel.isAdmin(req.session.admin.id)
      .then(isAdmin => {
        if (isAdmin) {
          next(); // Passez à la prochaine fonction de middleware si l'utilisateur est un administrateur
        } else {
            console.log("check admin3");
          res.redirect('/'); // Redirigez l'utilisateur vers la page d'accueil s'il n'est pas un administrateur
        }
      })
      .catch(err => {
        console.error('Erreur lors de la vérification du statut d\'administrateur:', err);
        res.status(500).send('Erreur lors de la vérification du statut d\'administrateur');
      });
  }
}


// Route pour afficher la page d'accueil administrateur
router.get('/', checkAdmin, function(req, res, next) {
  console.log("Accès à l'accueil administrateur");

  // Appeler la fonction readIsAdmin pour obtenir les utilisateurs et leur statut d'admin
  userModel.readIsAdmin()
      .then(usersWithAdminStatus => {
          // Envoyer les données à la vue
          res.render('accueil_admin', { 
              admin: req.session.admin,  // Info de l'admin de la session actuelle
              users: usersWithAdminStatus // Liste des utilisateurs et leur statut admin
          });
      })
      .catch(err => {
          console.error("Erreur lors de la récupération des utilisateurs :", err);
          res.status(500).send("Erreur lors de la récupération des utilisateurs.");
      });
});

// Route pour basculer le statut admin d'un utilisateur
router.post('/switchAdmin/:id', checkAdmin, function(req, res, next) {
  const userId = req.params.id; // Récupérer l'ID de l'utilisateur à partir de l'URL
  console.log(`Tentative de bascule du statut admin pour l'utilisateur avec ID: ${userId}`);

  // Vérifier si l'utilisateur est déjà admin
  adminModel.isAdmin(userId)
      .then(isAdmin => {
          console.log(`L'utilisateur avec ID: ${userId} est admin: ${isAdmin}`);

          if (isAdmin) {
              // Si l'utilisateur est admin, supprimer ses droits admin
              console.log(`Suppression des droits admin pour l'utilisateur avec ID: ${userId}`);
              return adminModel.deleteAdmin(userId);
          } else {
              // Sinon, lui donner les droits admin
              console.log(`Ajout des droits admin pour l'utilisateur avec ID: ${userId}`);
              return adminModel.createAdmin(userId);
          }
      })
      .then(() => {
          console.log(`Le statut admin de l'utilisateur avec ID: ${userId} a été mis à jour avec succès.`);
          // Après la mise à jour, rediriger vers l'accueil administrateur
          res.redirect('/admin');
      })
      .catch(err => {
          console.error("Erreur lors du changement de statut admin :", err);
          res.status(500).send("Erreur lors du changement de statut admin.");
      });
});

// Route pour afficher les jardins d'un utilisateur
router.get('/Jardin/:id', checkAdmin, function(req, res, next) {
  const userId = req.params.id; // Récupérer l'ID utilisateur à partir de l'URL

  // Appeler la fonction readFromUser pour obtenir les jardins de l'utilisateur
  jardinModel.readFromUser(userId)
      .then(jardins => {
          // Envoyer les jardins à la vue jardinAdmin.ejs
          res.render('jardinAdmin', {
              admin: req.session.admin, // Informations de l'admin de la session actuelle
              jardins: jardins, // Liste des jardins de l'utilisateur
              userId: userId // ID de l'utilisateur pour référence
          });
      })
      .catch(err => {
          console.error("Erreur lors de la récupération des jardins :", err);
          res.status(500).send("Erreur lors de la récupération des jardins.");
      });
});

// Route pour supprimer un jardin
router.get('/supprimer_jardin/:idjardin', checkAdmin, function(req, res, next) {
    const idJardin = req.params.idjardin; // Récupérer l'ID du jardin depuis les paramètres de l'URL

    // Récupérer et supprimer le jardin
    jardinModel.delete(idJardin)
        .then(result => {
            console.log(`Jardin avec ID ${idJardin} supprimé avec succès.`);
            res.redirect('/admin'); // Redirige vers la page d'accueil
        })
        .catch(err => {
            console.error("Erreur lors de la suppression du jardin :", err);
            res.status(500).send("Erreur serveur");
        });
});

// Route GET pour modifier un jardin
router.get('/modifier_jardin/:idjardin', checkAdmin, function(req, res) {
  // Récupérer l'id du jardin à partir des paramètres de l'URL
  const idJardin = req.params.idjardin;

  // Utiliser readById pour obtenir les informations du jardin
  jardinModel.readById(idJardin)
      .then(jardin => {
          if (jardin) {
              // Renvoyer la vue modif_jardin.ejs avec les informations du jardin
              res.render('modif_jardin2', { jardin: jardin });
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
router.post('/modifier_jardin/:idjardin', checkAdmin, function(req, res) {
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
  jardinModel.update(jardin)
      .then(rowCount => {
          if (rowCount > 0) {
              // Rediriger vers la page de succès ou afficher un message
              res.redirect('/admin'); // Redirige vers une page de détails du jardin, par exemple
          } else {
              res.status(404).send('Jardin non trouvé');
          }
      })
      .catch(err => {
          console.error("Erreur lors de la mise à jour du jardin :", err);
          res.status(500).send('Erreur serveur lors de la mise à jour du jardin');
      });
});

// Route pour afficher la page d'ajout de végétaux pour un jardin spécifique
router.get('/detail_jardin/:idjardin', checkAdmin, function(req, res, next) {
  const idJardin = req.params.idjardin; // Récupérer l'ID du jardin depuis les paramètres de l'URL

  // Récupérer les informations du jardin
  jardinModel.getAllInfoJardin(idJardin)
      .then(infoJardin => {
          // Récupérer les végétaux depuis la base de données
          console.log(infoJardin);
          return vegetauxModel.read().then(vegetaux => {
              // Rendre la vue et passer les végétaux, l'ID du jardin et les informations du jardin
              res.render('ajout_vegetaux2', { vegetaux: vegetaux, idJardin: idJardin, infoJardin: infoJardin });
          });
      })
      .catch(err => {
          console.error("Erreur lors de l'affichage de la page :", err);
          res.status(500).send("Erreur serveur");
      });
});

  
router.post('/creer_compo_jardin', checkAdmin, function(req, res, next) {
  const idJardin = req.body.id_jardin;
  const vegetalId = req.body.vegetal_id;
  const quantite = req.body.quantite;

  console.log(`ID du jardin : ${idJardin}`);
  console.log(`ID du végétal : ${vegetalId}`);
  console.log(`Quantité : ${quantite}`);

  // Vérification des données
  if (!idJardin || !vegetalId || !quantite) {
      console.error("Données manquantes. Reçu :", { idJardin, vegetalId, quantite });
      return res.status(400).send("Données invalides.");
  }

  // Créer un objet de composition
  const compo = {
      jardin: idJardin,
      vegetal: vegetalId,
      quantite: quantite
  };

  console.log("Objet composition créé :", compo);

  // Vérifier si la composition existe déjà
  compoJardinModel.exists(idJardin, vegetalId)
      .then(exists => {
          console.log(`La composition existe déjà ? ${exists}`);
          
          if (exists) {
              console.log("Ajout de la quantité à la composition existante.");
              return compoJardinModel.add(compo);
          } else {
              console.log("Création d'une nouvelle composition.");
              return compoJardinModel.create(compo)
                  .then(result => {
                      console.log("Nouvelle composition créée avec succès :", result);
                      // Récupérer les informations nécessaires uniquement si la ligne est créée
                      return Promise.all([
                          jardinModel.getAdresseById(idJardin),
                          vegetauxModel.getTemp_min(vegetalId),
                          vegetauxModel.getTemp_max(vegetalId),
                          vegetauxModel.getTemp_min_nuit(vegetalId),
                          vegetauxModel.getTemp_max_nuit(vegetalId)
                      ])
                      .then(([adresse, tempMin, tempMax, tempMinNuit, tempMaxNuit]) => {
                          console.log("Adresse du jardin récupérée :", adresse);
                          console.log(`Températures récupérées pour le végétal : Min=${tempMin}, Max=${tempMax}, Min Nuit=${tempMinNuit}, Max Nuit=${tempMaxNuit}`);

                          // Lancer le script Python avec les arguments
                          const command = `python3 ../code_exemple/calcul_jour_nuit.py "${adresse}" ${tempMin} ${tempMax} ${tempMinNuit} ${tempMaxNuit}`;
                          console.log("Commande exécutée :", command);

                          return new Promise((resolve, reject) => {
                              exec(command, (err, stdout, stderr) => {
                                  if (err) {
                                      console.error("Erreur lors de l'exécution du script Python :", err);
                                      reject(err);
                                  }
                                  console.log("Sortie du script Python :", stdout);
                                  const prediction = stdout.trim();
                                  console.log("Prédiction récupérée :", prediction);

                                  // Insérer la prévision de plantation dans la base de données
                                  return compoJardinModel.insertPred(idJardin, vegetalId, prediction)
                                      .then(() => {
                                          console.log("Prédiction insérée avec succès dans la base de données.");
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
          console.log(`Redirection vers le détail du jardin après la mise à jour de la composition: /admin/detail_jardin/${idJardin}`);
          res.redirect(`/admin/detail_jardin/${idJardin}`); // Redirection après la création ou mise à jour
      })
      .catch(err => {
          console.error("Erreur lors de l'ajout ou de la création de la composition :", err);
          res.status(500).send("Erreur lors de la mise à jour ou de la création de la composition.");
      });
});


// Route POST pour supprimer un légume du jardin
router.post('/supprimer_legume_jardin', function(req, res, next) {
  const jardinId = req.body.id_jardin; // ID du jardin à partir du formulaire
  const vegetalId = req.body.vegetal_id; // ID du végétal à supprimer

  // Utilisez la méthode delete du modèle pour supprimer la composition
  compoJardinModel.delete(jardinId, vegetalId)
      .then(() => {
          // Rediriger ou renvoyer une réponse de succès
          res.redirect(`/admin/detail_jardin/${jardinId}`); // Rediriger vers la page d'ajout de végétaux
      })
      .catch(err => {
          // En cas d'erreur, afficher un message d'erreur
          console.error("Erreur lors de la suppression du légume :", err);
          res.render('error', { error: "Une erreur s'est produite lors de la suppression du légume." });
      });
});

// Route pour afficher le formulaire avec l'ID utilisateur
router.get('/nouveau_jardin/:idUser', checkAdmin, function(req, res, next) {
  const userId = req.params.idUser; // Récupérer l'ID utilisateur depuis les paramètres de l'URL

  // Rendre la vue et passer l'ID de l'utilisateur à la vue
  res.render('newJardin2', { userId: userId });
});

// Route POST pour créer un jardin
router.post('/nouveau_jardin/creer_jardin', checkAdmin, function(req, res) {
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
  jardinModel.create(jardin)
      .then(result => {
          console.log("Jardin créé avec succès :", result);
          res.redirect('/admin'); // Rediriger vers la page des jardins
      })
      .catch(err => {
          console.error("Erreur lors de la création du jardin :", err);
          res.status(500).send("Erreur lors de la création du jardin.");
      });
});

module.exports = router;