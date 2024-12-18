# Generated by Django 5.1.1 on 2024-11-01 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0018_rename_quantity_payment_payment_term_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payment',
            old_name='method',
            new_name='payment_method',
        ),
        migrations.AlterField(
            model_name='purchaseorder',
            name='iva',
            field=models.DecimalField(blank=True, decimal_places=2, editable=False, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='purchaseorder',
            name='total',
            field=models.DecimalField(blank=True, decimal_places=2, editable=False, max_digits=10, null=True),
        ),
    ]
