# Generated by Django 5.1.1 on 2024-11-06 14:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0020_alter_customer_contact_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='purchase_order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payment', related_query_name='payment', to='Business.purchaseorder'),
        ),
        migrations.DeleteModel(
            name='PODetailChangeLog',
        ),
    ]