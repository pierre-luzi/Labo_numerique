# Generated by Django 3.2.20 on 2023-07-24 18:02

from django.db import migrations, models
import labo_num.models


class Migration(migrations.Migration):

    dependencies = [
        ('labo_num', '0005_auto_20230724_1658'),
    ]

    operations = [
        migrations.AddField(
            model_name='chapitre',
            name='fiche_revision',
            field=models.JSONField(default=labo_num.models.Chapitre.defaultJSON),
        ),
        migrations.DeleteModel(
            name='FicheRevision',
        ),
    ]
