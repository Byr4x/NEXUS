from django.db import models
import math
from Business.models import PODetail, Employee

class Supplier(models.Model):
    company_name = models.CharField(max_length=300)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    contact = models.CharField(max_length=200, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name
    
class RawMaterial(models.Model):
    name = models.CharField(max_length=25)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    raw_mateial_type_choices = {
        0: 'Materia prima',
        1: 'Recuperado',
        2: 'Aditivos',
        3: 'Tintas y pigmentos'
    }
    raw_material_type = models.PositiveIntegerField(choices=raw_mateial_type_choices, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Machine(models.Model):    
    name = models.CharField(max_length=30)
    area_choices = {
        0: 'N/A',
        1: 'Extrusión',
        2: 'Impresión',
        3: 'Sellado',
        4: 'Manualidad'
    }
    area = models.PositiveIntegerField(choices=area_choices, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class WorkOrder(models.Model):
    po_detail = models.ForeignKey(PODetail, on_delete=models.PROTECT, related_name='work_order', related_query_name='work_order_query')
    production_observations = models.TextField(null=True, blank=True)
    surplus_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    unit_weight = models.DecimalField(editable=False, max_digits=10, decimal_places=2)
    surplus_weight = models.DecimalField(editable=False, max_digits=10, decimal_places=2)
    wo_weight = models.DecimalField(editable=False, max_digits=10, decimal_places=2)
    status_choices = {
        0: 'Sin iniciar',
        1: 'En extrusión',
        2: 'En impresión',
        3: 'En sellado',
        4: 'En manualidad',
        5: 'En bodega',
        6: 'Terminado'
    }
    status = models.PositiveIntegerField(choices=status_choices, default=0)
    termination_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if self.po_detail:
            width = self.po_detail.width
            length = self.po_detail.length

            if self.po_detail.gussets_type == 1:
                width += self.po_detail.first_gusset + self.po_detail.second_gusset
            elif self.po_detail.gussets_type == 2:
                length += self.po_detail.first_gusset    

            if self.po_detail.flap_type != 0:
                length += (self.po_detail.flap_size / 2)

            self.unit_weight = width * length * self.po_detail.caliber * self.po_detail.material.weight_constant

            if self.po_detail.kilograms > 0:
                self.surplus_weight = self.po_detail.kilograms * (self.surplus_percentage / 100)
                self.wo_weight = self.po_detail.kilograms + self.surplus_weight
            else:    
                temp_weight = (self.unit_weight * self.po_detail.units) / 1000
                temp_weight = math.ceil(temp_weight) if temp_weight % 1 >= 0.01 else int(temp_weight)
                self.surplus_weight = temp_weight * (self.surplus_percentage / 100)
                self.wo_weight = temp_weight + self.surplus_weight

        super().save(*args, **kwargs)

next_choices = {
    0: 'Terminado',
    1: 'Extrusión',
    2: 'Impresión',
    3: 'Sellado',
    4: 'Manualidad'
}

class Extrusion(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='extrusion', related_query_name='extrusion_query')
    machine = models.ForeignKey(Machine, on_delete=models.PROTECT, related_name='extrusions', related_query_name='extrusion')
    roll_type_choices = {
        0: 'Tubular',
        1: 'Semi-tubular',
        2: 'Lamina',
        3: 'Lami-doble'
    }
    roll_type = models.PositiveIntegerField(choices=roll_type_choices, default=0)
    rolls_quantity = models.PositiveSmallIntegerField()
    caliber = models.DecimalField(max_digits=10, decimal_places=2)
    observations = models.TextField()
    next = models.PositiveIntegerField(choices=next_choices.items(), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class R_RawMaterial_Extrusion(models.Model):
    extrusion = models.ForeignKey(Extrusion, on_delete=models.CASCADE, related_name='materials', related_query_name='material')
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.PROTECT, related_name='extrusions', related_query_name='extrusion')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Printing(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='printing', related_query_name='printing_query')
    machine = models.ForeignKey(Machine, on_delete=models.PROTECT, related_name='printings', related_query_name='printing')
    is_new = models.BooleanField()
    observations = models.TextField()
    next = models.PositiveIntegerField(choices=next_choices.items(), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Sealing(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='sealing', related_query_name='sealing_query')
    machine = models.ForeignKey(Machine, on_delete=models.PROTECT, related_name='sealings', related_query_name='sealing')
    caliber = models.DecimalField(max_digits=10, decimal_places=2)
    hits = models.PositiveIntegerField()
    package_units = models.PositiveIntegerField()
    bundle_units = models.PositiveIntegerField()
    observations = models.TextField()
    next = models.PositiveIntegerField(choices=next_choices.items(), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Handicraf(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='handicraft', related_query_name='handicraft_query')
    machine = models.ForeignKey(Machine, on_delete=models.PROTECT, related_name='handicrafts', related_query_name='handicraft')
    observations = models.TextField()
    next = models.PositiveIntegerField(choices=next_choices.items(), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Touch(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='touch', related_query_name='touch_query')
    area_choices = {
        0: 'N/A',
        1: 'Extrusión',
        2: 'Impresión',
        3: 'Sellado',
        4: 'Manualidad'
    }
    area = models.PositiveIntegerField(choices=area_choices, default=0)
    total_finished_weight = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_finished_units = models.PositiveIntegerField(default=0)
    total_waste_weight = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    theorical_quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class TouchDetails(models.Model):
    touch = models.ForeignKey(Touch, on_delete=models.CASCADE, related_name='details', related_query_name='detail')
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='touchs', related_query_name='touch')
    finished_weight = models.DecimalField(max_digits=10, decimal_places=2)
    finished_units = models.PositiveIntegerField(null=True, blank=True)
    waste_weight = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver(post_save, sender=TouchDetails)
@receiver(post_delete, sender=TouchDetails)
def update_touch_totals(sender, instance, **kwargs):
    touch = instance.touch

    temp_total_finished_weight = touch.details.aggregate(total=models.Sum('finished_weight'))['total'] or 0
    temp_total_finished_units = touch.details.aggregate(total=models.Sum('finished_units'))['total'] or 0
    temp_total_waste_weight = touch.details.aggregate(total=models.Sum('waste_weight'))['total'] or 0

    touch.total_finished_weight_ = temp_total_finished_weight
    touch.total_finished_units = temp_total_finished_units
    touch.total_waste_weight = temp_total_waste_weight

    touch.save()
