from rest_framework import serializers
from .models import Customer, Position, Employee, ProductType, Material, Product, Reference, PurchaseOrder, Payment, PODetail 

class PODetailSerializer(serializers.ModelSerializer):  
    class Meta:
        model = PODetail
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    details = PODetailSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

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