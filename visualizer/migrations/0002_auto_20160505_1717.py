# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('visualizer', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uvsuivie',
            name='semestre_etudiant',
            field=models.CharField(max_length=5, db_column=b'GX'),
        ),
    ]
