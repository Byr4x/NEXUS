# Generated by Django 5.1.1 on 2024-10-24 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Business', '0005_alter_reference_additive'),
    ]

    operations = [
        migrations.AlterField(
            model_name='position',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]