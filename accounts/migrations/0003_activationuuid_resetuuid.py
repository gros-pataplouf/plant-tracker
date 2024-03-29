# Generated by Django 4.2.1 on 2023-05-21 21:50

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_user_table'),
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
            name='ResetUUID',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254)),
                ('expiry_time', models.DateTimeField(blank=True)),
            ],
        ),
    ]
