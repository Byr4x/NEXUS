from rest_framework import serializers
from .models import Supplier, RawMaterial, Machine, WorkOrder, Extrusion, R_RawMaterial_Extrusion, Printing, Sealing, Handicraf, Touch, TouchDetails

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = '__all__'

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = '__all__'

class WorkOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrder
        fields = '__all__'

class ExtrusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Extrusion
        fields = '__all__'

class R_RawMaterial_ExtrusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = R_RawMaterial_Extrusion
        fields = '__all__'

class PrintingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Printing
        fields = '__all__'

class SealingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sealing
        fields = '__all__'

class HandicrafSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handicraf
        fields = '__all__'

class TouchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Touch
        fields = '__all__'

class TouchDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TouchDetails
        fields = '__all__'
