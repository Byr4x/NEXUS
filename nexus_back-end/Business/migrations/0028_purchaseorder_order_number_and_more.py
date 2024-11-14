# Generated by Django 5.1.1 on 2024-11-14 15:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0027_rename_created_at_pochangelog_change_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchaseorder',
            name='order_number',
            field=models.CharField(default=100, max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pochangelog',
            name='model_name',
            field=models.CharField(choices=[('PurchaseOrder', 'PurchaseOrder'), ('PODetail', 'PODetail'), ('Payment', 'Payment')], max_length=50),
        ),
    ]
