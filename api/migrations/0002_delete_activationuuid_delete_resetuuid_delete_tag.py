# Generated by Django 4.2.1 on 2023-05-21 21:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ActivationUUID',
        ),
        migrations.DeleteModel(
            name='ResetUUID',
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
    ]
