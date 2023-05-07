from django.urls import path, include, re_path
from rest_framework import permissions
from django.conf import settings
from django.views.static import serve


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)

from .views import PlantDetail, PlantList, LocationDetail, LocationList, UserList, PlantImages, UserDetail, UserCreate, UserActivate, AuthTest, MyAccount, SendResetLink, ResetPassword, LocationImages

urlpatterns = [
    path('plants/', PlantList.as_view(), name="api_plant_list"),
    path('plants/images/', PlantImages.as_view(), name="api_plant_images"),
    path('plants/<int:pk>', PlantDetail.as_view(), name="api_plant_detail"),
    path('users/myaccount/', MyAccount.as_view(), name="api_user_myaccount"),
    path('users/', UserList.as_view(), name="api_user_list"),
    path('locations/', LocationList.as_view(), name="api_location_list"),
    path('locations/images/', LocationImages.as_view(), name="api_location_images"),
    path('locations/<int:pk>', LocationDetail.as_view(), name="api_location_detail"),
    path('register/', UserCreate.as_view(), name="api_user_create"),
    path('reset/', SendResetLink.as_view(), name="api_reset"),
    path('reset/<str:id>', ResetPassword.as_view(), name="api_reset_id"),
    path('activate/<str:id>', UserActivate.as_view(), name="api_user_activate"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/authtest/', AuthTest.as_view(), name='token_authtest'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),

   ]

urlpatterns += [
   path("auth/", include("rest_framework.urls")),
   ]

print(settings.DEBUG, settings.MEDIA_ROOT)
if settings.DEBUG:
        urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
    ]