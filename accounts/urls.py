from django.urls import path
from .views import MyAccount, UserList, CreateResetLink, ResetPassword, UserActivate
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)

urlpatterns = [
    path('me/', MyAccount.as_view(), name="accounts_me"),
    path('users/', UserList.as_view(), name="accounts_users"),
    path('reset/', CreateResetLink.as_view(), name="accounts_reset"),
    path('reset/<str:pk>/', ResetPassword.as_view(), name="accounts_reset_uuid"),
    path('activate/<str:id>', UserActivate.as_view(), name="accounts_activate_uuid"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
]