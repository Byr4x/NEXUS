# Generated by Django 5.1.1 on 2024-11-20 15:16

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0028_purchaseorder_order_number_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='podetail',
            name='pantones_codes',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(), blank=True, null=True, size=None),
        ),
    ]
