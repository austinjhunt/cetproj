# Generated by Django 2.1.8 on 2019-06-24 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cet', '0005_manufacturer_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='charge',
            field=models.FloatField(default=0),
        ),
    ]
