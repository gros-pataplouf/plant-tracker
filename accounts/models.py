from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    class Meta:
        db_table = 'auth_user'

    email = models.EmailField(_("email address"), blank=False, null=False, unique=True)

