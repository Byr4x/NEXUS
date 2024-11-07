# myapp/signals.py
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import PurchaseOrder, Payment, PODetail, POChangeLog
#from django.contrib.auth.models import User

@receiver(pre_save, sender=PurchaseOrder)
def log_purchase_order_changes(sender, instance, **kwargs):
    if instance.pk:  # Si el objeto ya existe, es una actualización
        old_instance = PurchaseOrder.objects.get(pk=instance.pk)
        for field in instance._meta.fields:
            field_name = field.name
            old_value = getattr(old_instance, field_name)
            new_value = getattr(instance, field_name)
            if old_value != new_value:
                POChangeLog.objects.create(
                    model_name='PurchaseOrder',
                    record_id=instance.pk,
                    field_name=field_name,
                    old_value=old_value,
                    new_value=new_value,
                    #changed_by=instance.user if hasattr(instance, 'user') else None
                )

@receiver(pre_save, sender=Payment)
def log_payment_changes(sender, instance, **kwargs):
    if instance.pk:  # Si el objeto ya existe, es una actualización
        old_instance = Payment.objects.get(pk=instance.pk)
        for field in instance._meta.fields:
            field_name = field.name
            old_value = getattr(old_instance, field_name)
            new_value = getattr(instance, field_name)
            if old_value != new_value:
                POChangeLog.objects.create(
                    model_name='Payment',
                    record_id=instance.pk,
                    field_name=field_name,
                    old_value=old_value,
                    new_value=new_value,
                    #changed_by=instance.user if hasattr(instance, 'user') else None
                )

@receiver(pre_save, sender=PODetail)
def log_podetail_changes(sender, instance, **kwargs):
    if instance.pk:  # Si el objeto ya existe, es una actualización
        old_instance = PODetail.objects.get(pk=instance.pk)
        for field in instance._meta.fields:
            field_name = field.name
            old_value = getattr(old_instance, field_name)
            new_value = getattr(instance, field_name)
            if old_value != new_value:
                POChangeLog.objects.create(
                    model_name='PODetail',
                    record_id=instance.pk,
                    field_name=field_name,
                    old_value=old_value,
                    new_value=new_value,
                    #changed_by=instance.user if hasattr(instance, 'user') else None
                )
