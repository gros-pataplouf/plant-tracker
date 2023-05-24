from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from .models import User, ResetUUID, ActivationUUID

admin.site.register(User, UserAdmin)
admin.site.register(ResetUUID)
admin.site.register(ActivationUUID)