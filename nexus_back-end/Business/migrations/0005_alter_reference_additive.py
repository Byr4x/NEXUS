# Generated by Django 5.1.1 on 2024-10-22 17:09

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0004_reference_measure_unit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reference',
            name='additive',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=30), blank=True, null=True, size=None),
        ),
    ]
