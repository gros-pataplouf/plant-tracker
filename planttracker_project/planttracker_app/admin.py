from django.contrib import admin

from planttracker_app.models import Tag, Location, Plant
# Register your models here.


admin.site.register(Tag)
admin.site.register(Location)
admin.site.register(Plant)
