# Generated by Django 5.1.1 on 2024-11-07 15:01

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0026_pochangelog'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pochangelog',
            old_name='created_at',
            new_name='change_date',
        ),
        migrations.RemoveField(
            model_name='pochangelog',
            name='changed_fields',
        ),
        migrations.RemoveField(
            model_name='pochangelog',
            name='previous_data',
        ),
        migrations.RemoveField(
            model_name='pochangelog',
            name='purchase_order',
        ),
        migrations.AddField(
            model_name='pochangelog',
            name='field_name',
            field=models.CharField(default=django.utils.timezone.now, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pochangelog',
            name='model_name',
            field=models.CharField(choices=[('PurchaseOrder', 'PurchaseOrder'), ('PODetail', 'PODetail')], default='PurchaseOrder', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pochangelog',
            name='new_value',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='pochangelog',
            name='old_value',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='pochangelog',
            name='record_id',
            field=models.PositiveIntegerField(default=1),
            preserve_default=False,
        ),
    ]
