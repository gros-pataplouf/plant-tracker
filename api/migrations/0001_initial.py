# Generated by Django 4.2.1 on 2023-05-21 20:49

import api.models
from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivationUUID',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254)),
                ('expiry_time', models.DateTimeField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('area', models.PositiveIntegerField()),
                ('description', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Plant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scientific_name', models.TextField(unique=True)),
                ('family', models.TextField()),
                ('common_name_de', models.TextField()),
                ('common_name_fr', models.TextField()),
                ('common_name_en', models.TextField()),
                ('description_de', models.TextField()),
                ('description_fr', models.TextField()),
                ('description_en', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ResetUUID',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254)),
                ('expiry_time', models.DateTimeField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.TextField(max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='PlantImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, upload_to=api.models.upload_to, verbose_name='Photo')),
                ('alt_en', models.TextField(blank=True)),
                ('alt_fr', models.TextField(blank=True)),
                ('alt_de', models.TextField(blank=True)),
                ('description_en', models.TextField(blank=True)),
                ('description_fr', models.TextField(blank=True)),
                ('description_de', models.TextField(blank=True)),
                ('plant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.plant')),
            ],
        ),
        migrations.CreateModel(
            name='LocationImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, upload_to=api.models.upload_to, verbose_name='Photo')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.location')),
            ],
        ),
        migrations.AddField(
            model_name='location',
            name='plant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.plant'),
        ),
    ]
