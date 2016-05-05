# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Etudiant',
            fields=[
                ('login', models.CharField(max_length=8, serialize=False, primary_key=True, db_column=b'loginEtudiant')),
            ],
            options={
                'db_table': 'Etudiant',
            },
        ),
        migrations.CreateModel(
            name='UV',
            fields=[
                ('code', models.CharField(max_length=5, serialize=False, primary_key=True, db_column=b'codeUV')),
                ('categorie', models.CharField(max_length=3, null=True, db_column=b'categorieUV')),
                ('nom', models.CharField(max_length=256, db_column=b'nomUV')),
                ('credits', models.IntegerField(db_column=b'nbCreditsUV')),
            ],
            options={
                'db_table': 'UV',
            },
        ),
        migrations.CreateModel(
            name='UVSuivie',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('semestre', models.CharField(max_length=5, db_column=b'codeSemestre')),
                ('semestre_etudiant', models.CharField(max_length=4, db_column=b'GX')),
                ('etudiant', models.ForeignKey(to='visualizer.Etudiant', db_column=b'loginEtudiant')),
                ('uv_suivie', models.ForeignKey(to='visualizer.UV', db_column=b'codeUV')),
            ],
            options={
                'db_table': 'Cursus',
            },
        ),
    ]
