from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Customer, Position, Employee, ProductType, Material, Reference, PurchaseOrder, Payment, PODetail
from .serializers import CustomerSerializer, PositionSerializer, EmployeeSerializer, ProductTypeSerializer, MaterialSerializer, ReferenceSerializer, PurchaseOrderSerializer, PaymentSerializer, PODetailSerializer
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
        instance = self.get_object()
        instance.delete()
        return Response({
            "status": "success",
            "message": f"{self.format_model_name()} deleted successfully."
        }, status=status.HTTP_204_NO_CONTENT)
    
class CustomerViewSet(BaseViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class PositionViewSet(BaseViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class EmployeeViewSet(BaseViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class ProductTypeViewSet(BaseViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer

class MaterialViewSet(BaseViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class ReferenceViewSet(BaseViewSet):
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer

class PurchaseOrderViewSet(BaseViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

class PaymentViewSet(BaseViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class PODetailViewSet(BaseViewSet):
    queryset = PODetail.objects.all()
    serializer_class = PODetailSerializer