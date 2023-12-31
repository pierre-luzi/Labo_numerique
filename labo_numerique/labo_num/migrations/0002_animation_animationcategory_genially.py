# Generated by Django 3.2.20 on 2023-07-24 12:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labo_num', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnimationCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=50, verbose_name='catégorie')),
            ],
            options={
                'verbose_name': 'Catégorie',
                'db_table': 'db_animations_categorie',
            },
        ),
        migrations.CreateModel(
            name='Genially',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titre', models.CharField(max_length=150)),
                ('description', models.TextField(blank=True, max_length=300, null=True)),
                ('slug', models.SlugField(unique=True)),
                ('img', models.ImageField(blank=True, null=True, upload_to='uploads/miniatures_anim/')),
                ('url', models.URLField(max_length=300)),
            ],
            options={
                'db_table': 'db_genially',
            },
        ),
        migrations.CreateModel(
            name='Animation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titre', models.CharField(max_length=150)),
                ('description', models.TextField(blank=True, max_length=150, null=True)),
                ('slug', models.SlugField(unique=True)),
                ('img', models.ImageField(blank=True, null=True, upload_to='uploads/miniatures_anim/')),
                ('visible', models.BooleanField(default=False)),
                ('date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('categories', models.ManyToManyField(to='labo_num.AnimationCategory')),
            ],
            options={
                'db_table': 'db_animation',
            },
        ),
    ]
