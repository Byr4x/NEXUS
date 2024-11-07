from rest_framework import serializers
from .models import Customer, Position, Employee, ProductType, Material, Product, Reference, PurchaseOrder, Payment, PODetail, POChangeLog
from Production.serializers import WorkOrderSerializer

class POChangeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = POChangeLog
        fields = '__all__'

class PODetailSerializer(serializers.ModelSerializer):  
    wo_number = serializers.IntegerField(read_only=True)
    work_order = WorkOrderSerializer(many=False, read_only=True)

    class Meta:
        model = PODetail
        fields = '__all__'

    def create(self, validated_data):
        # Obtener el último wo_number para este año
        from django.db.models import Max
        from datetime import datetime
        
        current_year = datetime.now().year
        last_wo = PODetail.objects.filter(
            created_at__year=current_year
        ).aggregate(Max('wo_number'))['wo_number__max']
        
        # Asignar el siguiente número
        validated_data['wo_number'] = (last_wo or 0) + 1
        
        return super().create(validated_data)

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    details = PODetailSerializer(many=True, read_only=True)
    payment = PaymentSerializer(many=False, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = '__all__'

class ReferenceSerializer(serializers.ModelSerializer):
    order_details = PODetailSerializer(many=True, read_only=True)

    class Meta:
        model = Reference
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    references = ReferenceSerializer(many=True, read_only=True)
    order_details = PODetailSerializer(many=True, read_only=True)

    class Meta:
        model = Material
        fields = '__all__'

class ProductTypeSerializer(serializers.ModelSerializer):
    references = ReferenceSerializer(many=True, read_only=True)
    order_details = PODetailSerializer(many=True, read_only=True)

    class Meta:
        model = ProductType
        fields = '__all__'
    
class EmployeeSerializer(serializers.ModelSerializer):
    order_details = PODetailSerializer(many=True, read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'

class PositionSerializer(serializers.ModelSerializer):
    employees = EmployeeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Position
        fields = '__all__'
    
class CustomerSerializer(serializers.ModelSerializer):
    references = ReferenceSerializer(many=True, read_only=True)
    purchase_orders = PurchaseOrderSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'