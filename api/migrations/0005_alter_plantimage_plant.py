# Generated by Django 4.2.1 on 2023-05-31 16:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_plantimage_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plantimage',
            name='plant',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='api.plant'),
        ),
    ]
