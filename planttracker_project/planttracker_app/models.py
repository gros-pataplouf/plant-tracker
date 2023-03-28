from django.contrib.gis.db import models
from django.conf import settings

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
    photo = models.ImageField(blank=True)
    tags = models.ManyToManyField(Tag, related_name="plants")
    def __str__(self):
        return self.scientific_name

class Location(models.Model):
    location = models.PointField()
    area = models.IntegerField()
    image = models.ImageField(blank=True) #upload_to='users/%Y/%m/%d/', 
    description = models.CharField(max_length=100)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    plant = models.ForeignKey(Plant, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

class ActivationUUID(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active=models.BooleanField(default=True)
    email=models.EmailField(blank=False)
