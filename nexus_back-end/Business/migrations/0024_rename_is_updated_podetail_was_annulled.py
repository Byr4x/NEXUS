# Generated by Django 5.1.1 on 2024-11-06 17:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0023_alter_payment_purchase_order'),
    ]

    operations = [
        migrations.RenameField(
            model_name='podetail',
            old_name='is_updated',
            new_name='was_annulled',
        ),
    ]