# **The Planttracker App**

## A citizen science project

Planttracker App is a mobile-first Single Page Application allowing users to learn about invasive plant species, upload GPS coordinates and photos of their findings and discover other users' submitted data.
Users can register to the app through email registration and manage and delete their account.

![Screenshot of the loading page](https://github.com/gros-pataplouf/plant-tracker/blob/main/readme.png?raw=true)

---

## [Live demo](https://planttracker.onrender.com/)

⚠️ _Please be patient while our backend service wakes up. Render's free instance spins down after 15 minutes of inactivity and it can take up to 2 minutes until the service responds to a new web request._

---

## Technologies & General Design

![Architecture](https://github.com/gros-pataplouf/plant-tracker/blob/main/architecture.drawio.svg?raw=true)

The planttracker app relies on React frontend consuming a Django REST framework API.
A PostgreSQL / PostGIS database stores geographical data where invasive plants have been found, as well as plant data and user accounts. Plant photos are stored in, and delivered to end devices from, an AWS S3 bucket. The REST API delivers data and image urls to the React Frontend. Authentication is done through [JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/index.html). Tokens are currently still stored in local storage but cookie storage is planned.
React Leaflet allows to visualize geographical data by displaying Leaflet layers as React components.
The React App also uses OpenStreetMap's [Nominatim API](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/index.html) for address lookup while Django uses it for reverse geocoding.

## Challenges & Solutions

### User account management

Django's Abstract User is slightly customized to enforce the uniqueness of the email address.
The Accounts API provides endpoints for

- creating inactive user accounts and sending them an Activation UUID by email.
- activating the account
- receiving a password reset link by email
- managing user accounts by viewing submissions, updating one's account and deleting it
- the account deletion endpoint perform actually a soft delete, scramling username and email and setting the account inactive, preserving user submitted data.
- email and password validation is implemented on both front- and backend

### API app (plant and location data)

Generic views are sufficient for the plant list and plant detail endpoint, as plant data are updated from django's integrated admin interface.
The endpoint for posting locations to the database is customized with the following features:

- the author of a submission is identified and added to the request data
- a user-friendly display name is generated for the submitted GPS data from OSM's Nominatim API
- images uploaded are linked to the related locations through a foreign key, stored in their own table and uploaded to AWS's S3 bucket.

### Leaflet customization

The challege is to provide a user-friendly interface where users can discover plant locations on their phone and submit their own data while geolocated outdoors.
Leaflet customizations include the following features:

For submitting data through a map:

- a map slipping under a dynamic marker, which stays in the center
- a custom control allowing to recenter the map to the detected location
- a search widget for centering the map to an address searched by the user
- The GPS data stored in state matches the location of the Dynamic Marker and is submitted with the form in the next step.

For exploring plant findings on the map:

- plant icon colors are generated on the fly according to the number of plants in the database
- a hideable Legend is displayed on the map for filtering the findings displayed
- clicking on customized popups allows accessing details of the finding with photos and a miniature map

## Image upload

One or several images can be uploaded and can be removed again by the user while they are displayed in a carousel.

## Installation

All instructions are intended for Linux Fedora and may very on other distribution.

### Run the frontend:

To see if you already have [Node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed and check the installed version, run the following commands:
`node -v`
`npm -v`

Or install node as per instructions [here](https://nodejs.org/en/download/package-manager)
and the run.
`npm install -g npm`

Install dependencies:
`cd frontend && npm install`

### Run the database locally:

- Ensure to have docker install.
- Pull the official kartoza image
  `docker pull kartoza/postgis:latest`
- run the database instance
  `docker run --name=postgis -d -e POSTGRES_USER=user001 -e POSTGRES_PASS=123456789 -e POSTGRES_DBNAME=gis -p 5432:5432 kartoza/postgis:latest`
- create a .env file from the sample.env file in the root folder and adapt the variables POSTGRES_USER, POSTGRES_DBNAME, POSTGRES_PASS

### Run the backend:

- install python 3.10 on your local machine
- install pipenv
  `pip install pipenv`
- cd to the folder containing Pipfile.lock and install dependencies
  `pipenv install`
- activate the virtual environment and run the server
  `pipenv shell && python manage.py runserver`
- if you are starting with an empty PostGIS database, migrate
  `python manage.py makemigrations && python manage.py migrate`
- create a superuser
  `python manage.py createsuperuser`

## Thanks & credits

Free Lottie animations used:

- Chinedu Chuks' [Plantix Animation](https://lottiefiles.com/130892-plantix-loader-logo-animation) has been the starting point for our loading page animation.
- [Green loading dots](https://lottiefiles.com/jkd1w8obe5) by Ignacio Farías Valladares
- [Transparent spinner](https://lottiefiles.com/46810-infinite-spinner) by Rav Kumar
- Geolocation animation has been removed from [Lottie](https://lottiefiles.com/), unknown author.
- All texts and information regarding invasive plant species origin from wikipedia and wikimedia, unless mentioned otherwise.
- The axios interceptor code has been borrowed from Very Academy's [Django tutorial series](https://youtu.be/soxd_xdHR0o)
- Last but not least, credits to my lovely wife Anja for her insights, design tips and valuable resources. ❤️
