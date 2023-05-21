from django.contrib import admin

from api.models import Location, Plant, PlantImage, LocationImage
# Register your models here.

admin.site.register(Location)
admin.site.register(Plant)
admin.site.register(LocationImage)
admin.site.register(PlantImage)