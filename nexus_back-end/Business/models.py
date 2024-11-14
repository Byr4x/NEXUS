from django.db import models
from django.contrib.postgres.fields import ArrayField
from decimal import Decimal

class Customer(models.Model):
    nit = models.PositiveIntegerField(unique=True)
    company_name = models.CharField(max_length=300)
    contact = models.CharField(max_length=200, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone_number = models.CharField(max_length=15, null=True, blank=True)
    location = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.company_name} - {self.contact}'

class Position(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True, null=True, blank=True)
    entity = models.CharField(max_length=200)
    position = models.ForeignKey(Position, on_delete=models.PROTECT, related_name='employees', related_query_name='employee')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.entity}'
    
class ProductType(models.Model):
    name = models.CharField(max_length=25)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Material(models.Model):
    name = models.CharField(max_length=25)
    description = models.TextField(null=True, blank=True)
    weight_constant = models.DecimalField(max_digits=8, decimal_places=6)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    product_type = models.ForeignKey(ProductType, on_delete=models.PROTECT, related_name='products', related_query_name='product')
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='products', related_query_name='product')
    image_url = models.URLField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Reference(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='references', related_query_name='reference')
    reference = models.TextField(blank=True)
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
    pantones_codes = ArrayField(models.CharField(max_length=30), null=True, blank=True)
    sketch_url = models.URLField(default='https://res.cloudinary.com/db5lqptwu/image/upload/v1728476524/sketches/hlmgblou2onqaf0efh6b.webp')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.reference
   
class PurchaseOrder(models.Model):
    order_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='purchase_orders', related_query_name='purchase_order')
    order_number = models.CharField(max_length=50)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='purchase_orders', related_query_name='purchase_order')
    observations = models.TextField(null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    has_iva = models.BooleanField(default=True)
    iva = models.DecimalField(max_digits=10, decimal_places=2, editable=False, null=True, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, editable=False, null=True, blank=True)
    delivery_date = models.DateField()
    was_annulled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.has_iva:
            self.iva = self.subtotal * Decimal('0.19')
        else:
            self.iva = Decimal('0')
        self.total = self.subtotal + self.iva
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Orden de Compra #{self.id} - {self.order_date} - {self.customer.company_name}'

class Payment(models.Model):
    purchase_order = models.OneToOneField(PurchaseOrder, on_delete=models.CASCADE, related_name='payment')
    method_choices = {
        0: 'CONTADO',
        1: 'CRÉDITO'
    }
    payment_method = models.CharField(max_length=20, choices=method_choices, default=0)
    payment_term = models.PositiveIntegerField(null=True, blank=True)
    advance = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.payment_method
    
class PODetail(models.Model):
    id = models.AutoField(primary_key=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='details', related_query_name='detail')
    reference = models.ForeignKey(Reference, on_delete=models.PROTECT, related_name='order_details', related_query_name='order_detail')
    reference_internal = models.CharField(max_length=200)
    product_type = models.ForeignKey(ProductType, on_delete=models.PROTECT, related_name='order_details',  related_query_name='order_detail')
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='order_details', related_query_name='order_detail')
    width = models.DecimalField(max_digits=10, decimal_places=2)
    length = models.DecimalField(max_digits=10, decimal_places=2)
    measure_unit_choices = {
        0: 'cm',
        1: 'pulg'
    }
    measure_unit = models.PositiveIntegerField(choices=measure_unit_choices, default=0)
    caliber = models.DecimalField(max_digits=10, decimal_places=2)
    film_color = models.CharField(max_length=25)
    kilograms = models.DecimalField(max_digits=10, decimal_places=2)
    units = models.PositiveIntegerField()
    kilogram_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
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
    production_observations = models.TextField(null=True, blank=True)
    delivery_location = models.CharField(max_length=150)
    is_new_sketch = models.BooleanField(default=False)
    sketch_url = models.URLField(default='https://res.cloudinary.com/db5lqptwu/image/upload/v1728476524/sketches/hlmgblou2onqaf0efh6b.webp')
    was_annulled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    wo_number = models.PositiveBigIntegerField(unique=True, editable=False, null=True)

    def save(self, *args, **kwargs):
        if not self.wo_number:
            last_wo = PODetail.objects.filter(wo_number__isnull=False).order_by('-wo_number').first()
            self.wo_number = (last_wo.wo_number + 1) if last_wo else 1
        super().save(*args, **kwargs)

    def __str__(self):
        after_return = ''
        if self.units > 0:
            after_return += f' x {self.units}'

        if self.kilograms > 0:
            after_return += f' | Peso: {self.kilograms}Kg'

        return f'{self.reference_internal}{after_return}'
    
class POChangeLog(models.Model):
    model_choices = [
        ('PurchaseOrder', 'PurchaseOrder'),
        ('PODetail', 'PODetail'),
        ('Payment', 'Payment')
    ]
    model_name = models.CharField(max_length=50, choices=model_choices)
    record_id = models.PositiveIntegerField()
    field_name = models.CharField(max_length=50)
    old_value = models.TextField(null=True, blank=True)
    new_value = models.TextField(null=True, blank=True)
    change_date = models.DateTimeField(auto_now_add=True)
    #changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.model_name} - {self.field_name} changed on {self.change_date}"


