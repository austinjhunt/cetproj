# Generated by Django 2.1.8 on 2019-06-24 19:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cet', '0003_auto_20190621_2004'),
    ]

    operations = [
        migrations.RenameField(
            model_name='manufacturer',
            old_name='primary_contact',
            new_name='phone_number',
        ),
    ]