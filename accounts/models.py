import uuid
from datetime import datetime, timedelta, timezone
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Meta:
        db_table = 'accounts_user'
    email = models.EmailField(_("email address"), blank=False, null=False, unique=True)

class ActivationUUID(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    expiry_time=models.DateTimeField(blank=True)
    def save(self, *args, **kwargs):
        self.expiry_time = (datetime.now(timezone.utc) + timedelta(hours=3)).isoformat()
        super().save(*args, **kwargs)

class ResetUUID(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    expiry_time=models.DateTimeField(blank=True)
    def save(self, *args, **kwargs):
        self.expiry_time = (datetime.now(timezone.utc) + timedelta(hours=3)).isoformat()
        super().save(*args, **kwargs)