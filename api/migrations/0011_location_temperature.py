# Generated by Django 4.2.1 on 2023-07-14 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_plant_ecology_de_plant_ecology_en_plant_ecology_fr_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='temperature',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]
