# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('visualizer', '0002_auto_20160505_1717'),
    ]

    operations = [
        migrations.AddField(
            model_name='uv',
            name='note',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='uv',
            name='note_last_update',
            field=models.DateTimeField(null=True),
        ),
    ]
