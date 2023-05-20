# Generated by Django 4.1.5 on 2023-04-12 14:16

import datetime
from django.db import migrations, models
import api.models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_activationuuid_expiry_time_alter_plant_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activationuuid',
            name='expiry_time',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 13, 14, 16, 57, 138737)),
        ),
        migrations.AlterField(
            model_name='location',
            name='image',
            field=models.ImageField(blank=True, upload_to=api.models.upload_to, verbose_name='Photo'),
        ),
    ]