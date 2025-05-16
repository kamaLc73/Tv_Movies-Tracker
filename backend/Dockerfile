FROM python:3.12-slim

# Crée le dossier de travail
WORKDIR /app

# Copie et installe les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie le code source
COPY . .

# Expose le port utilisé par FastAPI
EXPOSE 8000

# Démarre l'application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
