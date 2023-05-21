from django.urls import path
from .views import MyAccount, UserList, UserCreate, SendResetLink, ResetPassword, UserActivate, AuthTest


urlpatterns = [
    path('me/', MyAccount.as_view(), name="accounts_me"),
    path('users/', UserList.as_view(), name="accounts_users"),
    path('register/', UserCreate.as_view(), name="accounts_register"),
    path('reset/', SendResetLink.as_view(), name="accounts_reset"),
    path('reset/<str:id>', ResetPassword.as_view(), name="accounts_reset_uuid"),
    path('activate/<str:id>', UserActivate.as_view(), name="accounts_activate_uuid"),
    path('authtest/', AuthTest.as_view(), name='accounts_authtest'),

]