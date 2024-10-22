from django.db import models
from django.contrib.postgres.fields import ArrayField
from decimal import Decimal

class Customer(models.Model):
    nit = models.PositiveIntegerField(unique=True)
    company_name = models.CharField(max_length=300)
    contact = models.CharField(max_length=200, null=True, blank=True)
    contact_email = models.EmailField(unique=True, null=True, blank=True)
    contact_phone_number = models.CharField(max_length=15, null=True, blank=True)
    location = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.company_name} - {self.contact}'

class Position(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    second_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True, null=True, blank=True)
    entity = models.CharField(max_length=200, default='Beiplas')
    position = models.ForeignKey(Position, on_delete=models.PROTECT)

    def __str__(self):
        return f'{self.first_name} {self.second_name} - {self.entity}'
    
class ProductType(models.Model):
    name = models.CharField(max_length=25)
    description = models.TextField()

    def __str__(self):
        return self.name

class Material(models.Model):
    name = models.CharField(max_length=25)
    description = models.TextField()
    weight_constant = models.DecimalField(max_digits=8, decimal_places=6)

    def __str__(self):
        return self.name

class Reference(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='references', related_query_name='reference')
    reference = models.TextField(blank=True, editable=False)
    product_type = models.ForeignKey(ProductType, on_delete=models.PROTECT, related_name='references',  related_query_name='reference')
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='references', related_query_name='reference')
    width = models.DecimalField(max_digits=10, decimal_places=2)
    length = models.DecimalField(max_digits=10, decimal_places=2)
    measure_unit_choices = {
        0: 'cm',
        1: 'pulg'
    }
    measure_unit = models.PositiveIntegerField(choices=measure_unit_choices, default=0)
    caliber = models.DecimalField(max_digits=10, decimal_places=2)
    film_color = models.CharField(max_length=25)
    additive = ArrayField(models.CharField(max_length=30), null=True, blank=True)
    sealing_type_choices = {
        0: 'Sin sellado',
        1: 'Lateral',
        2: 'Fondo',
        3: 'Manual',
        4: 'Precorte',
        5: 'En "V"'
    }
    sealing_type = models.PositiveIntegerField(choices=sealing_type_choices, default=0)
    flap_type_choices = {
        0: 'Sin solapa',
        1: 'Interna',
        2: 'Interna doble',
        3: 'Externa',
        4: 'Volada'
    }
    flap_type = models.PositiveIntegerField(choices=flap_type_choices, default=0)
    flap_size = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    gussets_type_choices = {
        0: 'Sin fuelles',
        1: 'Lateral',
        2: 'Fondo'
    }
    gussets_type = models.PositiveIntegerField(choices=gussets_type_choices, default=0)
    first_gusset = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    second_gusset = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    tape_choices = {
        0: 'Sin cinta',
        1: 'Resellable',
        2: 'De seguridad'
    }
    tape = models.PositiveIntegerField(choices=tape_choices, default=0)
    die_cut_type_choices = {
        0: 'Sin troquel',
        1: 'Riñon',
        2: 'Camiseta',
        3: 'Perforaciones',
        4: 'Banderin',
        5: 'Cordon',
        6: 'Cubrevestido',
        7: 'Media luna',
        8: 'Selle de refuerzo',
    }
    die_cut_type = models.PositiveIntegerField(choices=die_cut_type_choices, default=0)
    roller_size = models.DecimalField(max_digits=10, decimal_places=2)
    dynas_treaty_faces_choices = {
        0: 'Ninguna',
        1: '1 cara',
        2: '2 caras'
    }
    dynas_treaty_faces = models.PositiveIntegerField(choices=dynas_treaty_faces_choices, default=0)
    pantones_quantity = models.PositiveBigIntegerField()
    pantones_codes = ArrayField(models.PositiveIntegerField(), null=True, blank=True)
    sketch_ult = models.URLField(default='https://res.cloudinary.com/db5lqptwu/image/upload/v1728476524/sketches/hlmgblou2onqaf0efh6b.webp')

    def save(self, *args, **kwargs):
        after_width = ''
        after_length = ''

        if self.gussets_type == 1:
            if self.first_gusset > 0:
                after_width += f' + F{self.first_gusset}'
            if self.second_gusset > 0:
                after_width += f' + F{self.second_gusset}'
        elif self.gussets_type == 2:
            if self.first_gusset > 0:
                after_length += f' + FF{self.first_gusset}'

        if self.flap_type != 0:
            after_length += f' + S{self.flap_size}'

        if self.measure_unit == 0:
            after_length += f' CM'
        elif self.measure_unit == 1:
            after_length += f' PULG'

        after_all = ''

        if self.tape == 1:
            after_all += f'CINTA RES'
        elif self.tape == 2:
            after_all += f'CINTA SEG'
        elif self.die_cut_type == 1:
            after_all += f'RIÑON'
        elif self.die_cut_type == 2:
            after_all += f'CAMISETA'
        elif self.die_cut_type == 3:
            after_all += f'PERFORACIONES'

        self.reference = f'{self.product_type.name.upper()} {self.material.name.upper()} {self.width}{after_width} x {self.length}{after_length}'

        if self.caliber > 0:
            self.reference += f' CAL {self.caliber} {after_all}'

        super().save(*args, **kwargs)

    def __str__(self):
        return self.reference
   
class PurchaseOrder(models.Model):
    order_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='purchase_orders', related_query_name='purchase_order')
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='purchase_orders', related_query_name='purchase_order')
    observations = models.TextField(null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    iva = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    total = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    delivery_date = models.DateField()

    def save(self, *args, **kwargs):
        self.iva = self.subtotal * Decimal('0.19')
        self.total = self.subtotal + self.iva
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Orden de Compra #{self.id} - {self.order_date} - {self.customer.company_name}'

class Payment(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='payment')
    method_choices = {
        0: 'CONTADO',
        1: 'CRÉDITO'
    }
    method = models.CharField(max_length=20, choices=method_choices, default=0)
    time_unit_choices = {
        0: 'N/A',
        1: 'Días',
        2: 'Semana',
        3: 'Meses',
        4: 'Años'
    }
    time_unit = models.PositiveIntegerField(choices=time_unit_choices, default=0)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    advance = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)

    def __str__(self):
        return self.method
    
class PODetail(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='details', related_query_name='detail')
    reference = models.ForeignKey(Reference, on_delete=models.PROTECT, related_name='order_details', related_query_name='order_detail')
    product_type = models.ForeignKey(ProductType, on_delete=models.PROTECT, related_name='order_details',  related_query_name='order_detail')
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='order_details', related_query_name='order_detail')
    width = models.DecimalField(max_digits=10, decimal_places=2)
    length = models.DecimalField(max_digits=10, decimal_places=2)
    caliber = models.DecimalField(max_digits=10, decimal_places=2)
    film_color = models.CharField(max_length=25)
    kilograms = models.DecimalField(max_digits=10, decimal_places=2)
    units = models.PositiveIntegerField()
    kilogram_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    additive = ArrayField(models.CharField(max_length=30))
    sealing_type_choices = {
        0: 'Sin sellado',
        1: 'Lateral',
        2: 'Fondo',
        3: 'Manual',
        4: 'Precorte',
        5: 'En "V"'
    }
    sealing_type = models.PositiveIntegerField(choices=sealing_type_choices, default=0)
    flap_type_choices = {
        0: 'Sin solapa',
        1: 'Interna',
        2: 'Interna doble',
        3: 'Externa',
        4: 'Volada'
    }
    flap_type = models.PositiveIntegerField(choices=flap_type_choices, default=0)
    flap_size = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    gussets_type_choices = {
        0: 'Sin fuelles',
        1: 'Lateral',
        2: 'Fondo'
    }
    gussets_type = models.PositiveIntegerField(choices=gussets_type_choices, default=0)
    first_gusset = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    second_gusset = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    tape_choices = {
        0: 'Sin cinta',
        1: 'Resellable',
        2: 'De seguridad'
    }
    tape = models.PositiveIntegerField(choices=tape_choices, default=0)
    die_cut_type_choices = {
        0: 'Sin troquel',
        1: 'Riñon',
        2: 'Camiseta',
        3: 'Perforaciones',
        4: 'Banderin',
        5: 'Cordon',
        6: 'Cubrevestido',
        7: 'Media luna',
        8: 'Selle de refuerzo',
    }
    die_cut_type = models.PositiveIntegerField(choices=die_cut_type_choices, default=0)
    roller_size = models.DecimalField(max_digits=10, decimal_places=2)
    dynas_treaty_faces_choices = {
        0: 'Ninguna',
        1: '1 cara',
        2: '2 caras'
    }
    dynas_treaty_faces = models.PositiveIntegerField(choices=dynas_treaty_faces_choices, default=0)
    pantones_quantity = models.PositiveBigIntegerField()
    pantones_codes = ArrayField(models.PositiveIntegerField(), null=True, blank=True)
    production_observations = models.TextField(null=True, blank=True)
    delivery_location = models.CharField(max_length=150)
    observations = models.TextField(null=True, blank=True)
    is_new_sketch = models.BooleanField(default=False)
    sketch_ult = models.URLField(default='https://res.cloudinary.com/db5lqptwu/image/upload/v1728476524/sketches/hlmgblou2onqaf0efh6b.webp')
    
    wo_number = models.PositiveIntegerField(null=True, blank=True, editable=False)

    def save(self, *args, **kwargs):
        from Production.models import WorkOrder
        work_order = WorkOrder.objects.create(
            po_detail = self.id,
            production_observations=self.production_observations
        )
        self.wo_number = work_order.id
        super().save(*args, **kwargs)

    def __str__(self):
        after_return = ''
        if self.units > 0:
            after_return += f' x {self.units}'

        if self.kilograms > 0:
            after_return += f' | Peso: {self.kilograms}Kg'

        return f'{self.reference.reference}{after_return}'
