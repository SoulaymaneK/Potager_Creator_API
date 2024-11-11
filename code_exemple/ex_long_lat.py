import sys
from geopy.geocoders import Nominatim

# Vérifier qu'un argument est fourni
if len(sys.argv) < 2:
    print("Veuillez fournir une adresse en argument.")
    sys.exit(1)

# Récupérer l'adresse depuis les arguments de la ligne de commande
adresse = sys.argv[1]

# Initialiser le géocodeur Nominatim
geolocator = Nominatim(user_agent="my_unique_app_name")

# Géocodage pour obtenir la latitude et la longitude
location = geolocator.geocode(adresse)

# Vérifier si l'adresse a été trouvée et afficher les coordonnées
if location:
    print(f"Latitude: {location.latitude}, Longitude: {location.longitude}")
else:
    print("Adresse non trouvée")
