# Projet IC05

Plateforme de visualisation du parcours des étudiants.

## Installation

L'installation requiert pip, [bower](http://bower.io/) et [npm](https://www.npmjs.com/) installés sur votre machine. Elle passe par l'installation des dépendances Python et front-end et la création d'un fichier de configuration en fonction de la base de données. 

1. Pour installer les dépendances Python : lancer `pip install -r requirements.txt`. L'utilisation d'un virtualenv avant l'installation des dépendances est recommandée mais n'est pas indispensable. Pour cela, créer un virtualenv avec `virtualenv env`, puis l'activer dans chaque terminal avec `source env/bin/activate`.
2. Se rendre avec un terminal dans le dossier `visualizer/static`.
3. Pour installer jquery et Materialize : lancer `bower install`. Pour installer sigma.js et linkurious.js : lancer `npm install`.
4. Créer un fichier de configuration `ic05backend/local_settings.ini`. Le fichier `ic05backend/local_settings.example.ini` sert d'example pour le stockage de la configuration. (Note : par défaut, il n'y a pas besoin de spécifier le port de la base de données, sauf si votre SGBD utilise un port particulier).
5. Une fois la base de données installée (cf plus bas), lancer le serveur avec `python manage.py runserver 0.0.0.0:80`.

### Pour l'utilisation d'une base de données MySQL

1. Installer python-dev avec `apt-get install python-dev`.
2. Installer PyMySQL avec `pip install PyMySQL`.
3. Utiliser comme variable `engine` dans la configuration : `django.db.backends.mysql`.

### Pour l'utilisation d'une base de données PostgreSQL

1. Installer psycopg2 avec `pip install psycopg2`.
2. Utiliser comme variable `engine` dans la configuration : `django.db.backends.postgresql_psycopg2`.
