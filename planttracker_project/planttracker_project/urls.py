from django.contrib.gis import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('planttracker_app.api.urls')),
]