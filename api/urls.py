from django.urls import path, include, re_path
from rest_framework import permissions
from django.conf import settings
from django.views.static import serve

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)

from .views import PlantDetail, PlantList, LocationDetail, LocationList, PlantImages, LocationImages

urlpatterns = [
    path('plants/', PlantList.as_view(), name="api_plant_list"),
    path('plants/images/', PlantImages.as_view(), name="api_plant_images"),
    path('plants/<int:pk>', PlantDetail.as_view(), name="api_plant_detail"),
    path('locations/', LocationList.as_view(), name="api_location_list"),
    path('locations/images/', LocationImages.as_view(), name="api_location_images"),
    path('locations/<int:pk>', LocationDetail.as_view(), name="api_location_detail"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
   ]

urlpatterns += [
   path("auth/", include("rest_framework.urls")),
   ]

if settings.DEBUG:
        urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
    ]