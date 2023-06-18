import uuid
from django.contrib.gis.db import models
from django.conf import settings
from datetime import datetime, timezone, timedelta
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.storage_backends import PublicMediaStorage

User = get_user_model()


def upload_to(instance, filename):
    extension=filename.split('.')[-1]
    file_id=uuid.uuid4()
    return f'{file_id}.{extension}'

class Plant(models.Model):
    scientific_name = models.TextField(unique=True)
    family = models.TextField()
    common_name_de = models.TextField(null=True)
    common_name_fr = models.TextField(null=True)
    common_name_en = models.TextField()
    description_de = models.TextField(null=True)
    description_fr = models.TextField(null=True)
    description_en = models.TextField()
    identification_de = models.TextField(null=True)
    identification_fr = models.TextField(null=True)
    identification_en = models.TextField(null=True)
    ecology_de = models.TextField(null=True)
    ecology_fr = models.TextField(null=True)
    ecology_en = models.TextField(null=True)
    def __str__(self):
        return self.scientific_name

class Location(models.Model):
    location = models.PointField()
    display_name = models.CharField(max_length=500, null=True, blank=True)
    area = models.PositiveIntegerField()
    description = models.CharField(max_length=100, blank=True)
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    plant = models.ForeignKey(Plant, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

class PlantImage(models.Model):
    image = models.ImageField(_("Photo"), upload_to=upload_to, blank=True, storage=PublicMediaStorage())
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, blank=True, null=True)
    type = models.CharField(choices=[('main','main'), ('secondary', 'secondary'), ('default', 'default'), ('identification', 'identification')], max_length=20) 
    alt_en = models.TextField(blank=True)
    alt_fr = models.TextField(blank=True)
    alt_de = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_fr = models.TextField(blank=True)
    description_de = models.TextField(blank=True)


class LocationImage(models.Model):
    image = models.ImageField(_("Photo"), upload_to=upload_to, blank=True, storage=PublicMediaStorage())
    location = models.ForeignKey(Location, on_delete=models.CASCADE)


