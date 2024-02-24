from .base import *

DEBUG = False
SECURE_HSTS_SECONDS = 360000
SECURE_SSL_REDIRECT = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS = ["*"]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

CORS_ALLOWED_ORIGINS = ["https://planttracker.vercel.app"]
print("secure_key", SECRET_KEY, DEBUG)

DATABASES = {
    'default': {
    'ENGINE': 'django.contrib.gis.db.backends.postgis',
    'NAME': os.getenv("DB_NAME"),
    'USER': os.getenv("DB_USER"),
    'PASSWORD': os.getenv("DB_PASSWORD"),
    'HOST': os.getenv("DB_HOST"),
    'PORT': os.getenv("DB_PORT"),
    }
}

try:
    from .local import *
except ImportError:
    pass
