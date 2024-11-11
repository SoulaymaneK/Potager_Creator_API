import sys
from geopy.geocoders import Nominatim
from datetime import datetime
from meteostat import Point, Hourly
import pandas as pd
import matplotlib.pyplot as plt

# Vérifier qu'un argument est fourni
if len(sys.argv) < 4:
    print("Veuillez fournir une adresse, une température min et une température max en arguments.")
    sys.exit(1)

# Récupérer l'adresse et les températures depuis les arguments de la ligne de commande
adresse = sys.argv[1]
temp_min = float(sys.argv[2])
temp_max = float(sys.argv[3])

# Initialiser le géocodeur Nominatim
geolocator = Nominatim(user_agent="my_unique_app_name")

# Géocodage pour obtenir la latitude et la longitude
location = geolocator.geocode(adresse)

# Vérifier si l'adresse a été trouvée et afficher les coordonnées
if location:
    print(f"Latitude: {location.latitude}, Longitude: {location.longitude}")
else:
    print("Adresse non trouvée")
    sys.exit(1)

# Définir la localisation
point = Point(location.latitude, location.longitude)

# Définir la période pour les données historiques
start = datetime(2023, 1, 1)
end = datetime(2023, 12, 31)

# Télécharger les données horaires pour la période définie
data = Hourly(point, start, end)
data = data.fetch()

# Filtrer les données pour obtenir uniquement les températures à 12h (midi)
temps_at_noon = data[data.index.hour == 12]['temp']

# Calculer la température moyenne pour chaque mois à 12h
temps_monthly_avg_at_noon = temps_at_noon.resample('M').mean()

# Afficher les températures moyennes de chaque mois à 12h
#print(temps_monthly_avg_at_noon)

# Préparer les données pour le diagramme à barres
months = temps_monthly_avg_at_noon.index.strftime('%B')  # Obtenir les noms des mois
temps_values = temps_monthly_avg_at_noon.values  # Valeurs des températures

# Créer un tableau de couleurs pour les barres
colors = ['green' if temp_min <= temp <= temp_max else 'red' for temp in temps_values]

# Trouver les mois qui sont dans la plage donnée
months_in_range = months[(temps_values >= temp_min) & (temps_values <= temp_max)]

if months_in_range.size > 0:
    print("Mois avec des températures moyennes à midi entre les limites données :")
    print(", ".join(months_in_range))
else:
    print("Aucun mois trouvé avec des températures moyennes à midi dans la plage donnée.")

# Visualiser les températures mensuelles dans un diagramme à barres
#plt.figure(figsize=(10, 6))
#plt.bar(months, temps_values, color=colors)
#plt.axhline(y=temp_min, color='blue', linestyle='--', label='Température min')
#plt.axhline(y=temp_max, color='orange', linestyle='--', label='Température max')
#plt.title("Températures moyennes à midi par mois (2023)")
#plt.ylabel("Température moyenne (°C)")
#plt.xlabel("Mois")
#plt.xticks(rotation=45)
#plt.legend()
#plt.tight_layout()
#plt.show()
