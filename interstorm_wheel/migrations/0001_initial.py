# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2019-05-21 08:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='test_db',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='-', max_length=255)),
                ('detail', models.TextField(default='-', max_length=255)),
            ],
            options={
                'db_table': 'test_db',
            },
        ),
    ]
