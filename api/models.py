import uuid
from django.contrib.gis.db import models
from django.conf import settings
import datetime
from django.utils.translation import gettext_lazy as _

def upload_to(instance, filename):
    extension=filename.split('.')[-1]
    file_id=uuid.uuid4()
    return f'{file_id}.{extension}'

class Tag(models.Model):
    value = models.TextField(max_length=15)
    def __str__(self):
        return self.value

class Plant(models.Model):
    scientific_name = models.TextField(unique=True)
    family = models.TextField()
    common_name_de = models.TextField()
    common_name_fr = models.TextField()
    common_name_en = models.TextField()
    description_de = models.TextField()
    description_fr = models.TextField()
    description_en = models.TextField()
    # photo = models.ImageField(_("Photo"), upload_to=upload_to, blank=True)
    # tags = models.ManyToManyField(Tag, related_name="plants")
    def __str__(self):
        return self.scientific_name

class Location(models.Model):
    location = models.PointField()
    area = models.PositiveIntegerField()
    # image = models.ImageField(_("Photo"), upload_to=upload_to, blank=True)
    description = models.CharField(max_length=100, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    plant = models.ForeignKey(Plant, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

class ActivationUUID(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email=models.EmailField(blank=False)
    expiry_time=models.DateTimeField(default=datetime.datetime.now() + datetime.timedelta(days=1))

class ResetUUID(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email=models.EmailField(blank=False)
    expiry_time=models.DateTimeField(default=datetime.datetime.now() + datetime.timedelta(days=1))


#will be used for multiple image upload from admin area
class PlantImage(models.Model):
    image = models.ImageField(_("Photo"), upload_to=upload_to, blank=True)
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    alt_en = models.TextField(blank=True)
    alt_fr = models.TextField(blank=True)
    alt_de = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_fr = models.TextField(blank=True)
    description_de = models.TextField(blank=True)

class LocationImage(models.Model):
    image = models.ImageField(_("Photo"), upload_to=upload_to, blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
