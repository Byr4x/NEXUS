from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Supplier, RawMaterial, Machine, WorkOrder, Extrusion, R_RawMaterial_Extrusion, Printing, Sealing, Handicraf, Touch, TouchDetails
from .serializers import SupplierSerializer, RawMaterialSerializer, MachineSerializer, WorkOrderSerializer, ExtrusionSerializer, R_RawMaterial_ExtrusionSerializer, PrintingSerializer, SealingSerializer, HandicrafSerializer, TouchSerializer, TouchDetailsSerializer
import re

class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]

    def format_model_name(self):
        model_name = self.get_queryset().model.__name__
        formatted_name = re.sub(r'(?<!^)(?=[A-Z])', ' ', model_name)
        return formatted_name

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({
                "status": "success",
                "data": serializer.data,
                "message": f"{self.format_model_name()} created successfully."
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": "error",
            "errors": serializer.errors,
            "message": f"Failed to create {(self.format_model_name()).lower()}."
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({
                "status": "success",
                "data": serializer.data,
                "message": f"{self.format_model_name()} updated successfully."
            }, status=status.HTTP_200_OK)
        return Response({
            "status": "error",
            "errors": serializer.errors,
            "message": f"Failed to update {(self.format_model_name()).lower()}."
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({
                "status": "success",
                "message": f"{self.format_model_name()} deleted successfully."
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "error",
                "message": f"Failed to delete {(self.format_model_name()).lower()}.",
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
class SupplierViewSet(BaseViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class RawMaterialViewSet(BaseViewSet):
    queryset = RawMaterial.objects.all()
    serializer_class = RawMaterialSerializer

class MachineViewSet(BaseViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

class WorkOrderViewSet(BaseViewSet):
    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderSerializer

class ExtrusionViewSet(BaseViewSet):
    queryset = Extrusion.objects.all()
    serializer_class = ExtrusionSerializer

class R_RawMaterial_ExtrusionViewSet(BaseViewSet):
    queryset = R_RawMaterial_Extrusion.objects.all()
    serializer_class = R_RawMaterial_ExtrusionSerializer

class PrintingViewSet(BaseViewSet):
    queryset = Printing.objects.all()
    serializer_class = PrintingSerializer

class SealingViewSet(BaseViewSet):
    queryset = Sealing.objects.all()
    serializer_class = SealingSerializer

class HandicrafViewSet(BaseViewSet):
    queryset = Handicraf.objects.all()
    serializer_class = HandicrafSerializer

class TouchViewSet(BaseViewSet):
    queryset = Touch.objects.all()
    serializer_class = TouchSerializer

class TouchDetailsViewSet(BaseViewSet):
    queryset = TouchDetails.objects.all()
    serializer_class = TouchDetailsSerializer