from datetime import datetime
from meteostat import Point, Hourly
import pandas as pd
import matplotlib.pyplot as plt

# Définir une localisation (par exemple, Paris)
location = Point(48.8566, 2.3522)

# Définir la période pour les données historiques
start = datetime(2023, 1, 1)
end = datetime(2023, 12, 31)

# Télécharger les données horaires pour la période définie
data = Hourly(location, start, end)
data = data.fetch()

# Filtrer les données pour obtenir uniquement les températures à 12h (midi)
temps_at_noon = data[data.index.hour == 12]['temp']

# Calculer la température moyenne pour chaque mois à 12h
temps_monthly_avg_at_noon = temps_at_noon.resample('M').mean()

# Afficher les températures moyennes de chaque mois à 12h
print(temps_monthly_avg_at_noon)

# Visualiser les températures moyennes mensuelles à 12h
temps_monthly_avg_at_noon.plot(title="Températures moyennes mensuelles à 12h (2023)", ylabel="Température moyenne (°C)")
plt.show()
