# Generated by Django 3.2.20 on 2023-07-25 11:04

from django.db import migrations
import froala_editor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('labo_num', '0012_rename_contenu_chapitre_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='chapitre',
            name='notions',
            field=froala_editor.fields.FroalaField(null=True),
        ),
    ]
