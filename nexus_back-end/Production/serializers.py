from rest_framework import serializers
from .models import Supplier, RawMaterial, Machine, WorkOrder, Extrusion, R_RawMaterial_Extrusion, Printing, Sealing, Handicraf, WOChangeLog, Touch, TouchDetails

class TouchDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TouchDetails
        fields = '__all__'

class TouchSerializer(serializers.ModelSerializer):
    details = TouchDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Touch
        fields = '__all__'

class WOChangeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WOChangeLog
        fields = '__all__'

class HandicrafSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handicraf
        fields = '__all__'

class SealingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sealing
        fields = '__all__'    

class PrintingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Printing
        fields = '__all__'

class R_RawMaterial_ExtrusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = R_RawMaterial_Extrusion
        fields = '__all__'

class ExtrusionSerializer(serializers.ModelSerializer):
    materials = R_RawMaterial_ExtrusionSerializer(many=True, read_only=True)

    class Meta:
        model = Extrusion
        fields = '__all__'

class WorkOrderSerializer(serializers.ModelSerializer):
    change_logs = WOChangeLogSerializer(many=True, read_only=True)
    extrusion = ExtrusionSerializer(many=False, read_only=True)
    printing = PrintingSerializer(many=False, read_only=True)
    sealing = SealingSerializer(many=False, read_only=True)
    handicraft = HandicrafSerializer(many=False, read_only=True)
    touch = TouchSerializer(many=False, read_only=True)
    
    class Meta:
        model = WorkOrder
        fields = '__all__'

class MachineSerializer(serializers.ModelSerializer):
    extrusions = ExtrusionSerializer(many=True, read_only=True)
    printings = PrintingSerializer(many=True, read_only=True)
    sealings = SealingSerializer(many=True, read_only=True)
    handicrafts = HandicrafSerializer(many=True, read_only=True)
    
    class Meta:
        model = Machine
        fields = '__all__'

class RawMaterialSerializer(serializers.ModelSerializer):
    extrusions = R_RawMaterial_ExtrusionSerializer(many=True, read_only=True)

    class Meta:
        model = RawMaterial
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'