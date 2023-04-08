from django.urls import path, include, re_path
from rest_framework import permissions
from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import PlantDetail, PlantList, LocationDetail, LocationList, UserDetail, UserCreate, UserActivate, AuthTest

urlpatterns = [
    path('plants/', PlantList.as_view(), name="api_plant_list"),
    path('plants/<int:pk>', PlantDetail.as_view(), name="api_plant_detail"),
    path('users/<str:username>/', UserDetail.as_view(), name="api_user_detail"),
    path('locations/', LocationList.as_view(), name="api_location_list"),
    path('locations/<int:pk>', LocationDetail.as_view(), name="api_location_detail"),
    path('register/', UserCreate.as_view(), name="api_user_create"),
    path('activate/<str:id>', UserActivate.as_view(), name="api_user_activate"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/authtest/', AuthTest.as_view(), name='auth_test'),
   ]

urlpatterns += [
   path("auth/", include("rest_framework.urls")),
   ]
