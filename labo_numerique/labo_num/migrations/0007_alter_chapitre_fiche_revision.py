# Generated by Django 3.2.20 on 2023-07-24 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labo_num', '0006_auto_20230724_1802'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chapitre',
            name='fiche_revision',
            field=models.JSONField(default=list),
        ),
    ]
