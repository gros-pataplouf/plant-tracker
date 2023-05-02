from django.contrib import admin

from planttracker_app.models import Tag, Location, Plant, ActivationUUID, PlantImage, LocationImage
# Register your models here.

admin.site.register(Tag)
admin.site.register(Location)
admin.site.register(Plant)
admin.site.register(ActivationUUID)
admin.site.register(LocationImage)
admin.site.register(PlantImage)