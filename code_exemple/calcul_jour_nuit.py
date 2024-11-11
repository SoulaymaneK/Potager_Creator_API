import sys
from geopy.geocoders import Nominatim
from datetime import datetime
from meteostat import Point, Hourly
import pandas as pd
import matplotlib.pyplot as plt

# Vérifier qu'un argument est fourni
if len(sys.argv) < 6:
    print("Veuillez fournir une adresse, une température min et max pour midi, puis une température min et max pour la nuit en arguments.")
    sys.exit(1)

# Récupérer l'adresse et les températures depuis les arguments de la ligne de commande
adresse = sys.argv[1]
temp_min_midi = float(sys.argv[2])
temp_max_midi = float(sys.argv[3])
temp_min_nuit = float(sys.argv[4])
temp_max_nuit = float(sys.argv[5])

# Initialiser le géocodeur Nominatim
geolocator = Nominatim(user_agent="my_unique_app_name")

# Géocodage pour obtenir la latitude et la longitude
location = geolocator.geocode(adresse)

# Vérifier si l'adresse a été trouvée et afficher les coordonnées
#if location:
    #print(f"Latitude: {location.latitude}, Longitude: {location.longitude}")
#else:
    #print("Adresse non trouvée")
    #sys.exit(1)

# Définir la localisation
point = Point(location.latitude, location.longitude)

# Définir la période pour les données historiques
start = datetime(2023, 1, 1)
end = datetime(2023, 12, 31)

# Télécharger les données horaires pour la période définie
data = Hourly(point, start, end)
data = data.fetch()

# Filtrer les données pour obtenir uniquement les températures à 12h (midi) et à 4h du matin
temps_at_noon = data[data.index.hour == 12]['temp']
temps_at_4am = data[data.index.hour == 4]['temp']

# Calculer la température moyenne pour chaque mois à 12h et à 4h du matin
temps_monthly_avg_at_noon = temps_at_noon.resample('M').mean()
temps_monthly_avg_at_4am = temps_at_4am.resample('M').mean()

# Préparer les données pour le diagramme à barres
months = temps_monthly_avg_at_noon.index.strftime('%B')  # Obtenir les noms des mois
temps_values_noon = temps_monthly_avg_at_noon.values  # Valeurs des températures à midi
temps_values_4am = temps_monthly_avg_at_4am.values  # Valeurs des températures à 4h du matin

# Trouver les mois qui sont dans la plage donnée pour midi et pour la nuit
months_in_range_noon = months[(temps_values_noon >= temp_min_midi) & (temps_values_noon <= temp_max_midi)]
months_in_range_4am = months[(temps_values_4am >= temp_min_nuit) & (temps_values_4am <= temp_max_nuit)]

# Trouver les mois qui répondent aux deux critères
months_in_range_both = set(months_in_range_noon).intersection(set(months_in_range_4am))

if len(months_in_range_both) > 0:
    # print("Mois avec des températures moyennes à midi et à 4h du matin dans les limites données :")
    print(", ".join(months_in_range_both))
else:
    print("Aucun mois trouvé avec des températures moyennes à midi et à 4h du matin dans les plages données.")
