# Generated by Django 4.1.5 on 2023-04-12 14:14

import datetime
from django.db import migrations, models
import planttracker_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('planttracker_app', '0012_alter_activationuuid_expiry_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activationuuid',
            name='expiry_time',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 13, 14, 14, 37, 255826)),
        ),
        migrations.AlterField(
            model_name='plant',
            name='photo',
            field=models.ImageField(blank=True, upload_to=planttracker_app.models.upload_to, verbose_name='Photo'),
        ),
    ]
