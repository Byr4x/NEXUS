# Generated by Django 5.1.1 on 2024-10-31 18:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0017_alter_podetail_id_alter_podetail_wo_number'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payment',
            old_name='quantity',
            new_name='payment_term',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='time_unit',
        ),
    ]
