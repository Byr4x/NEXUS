from rest_framework import routers
from .api import CustomerViewSet, PositionViewSet, EmployeeViewSet, ProductTypeViewSet, MaterialViewSet, ReferenceViewSet, PurchaseOrderViewSet, PaymentViewSet, PODetailViewSet

router = routers.DefaultRouter()

router.register('customers', CustomerViewSet, 'customers')
router.register('positions', PositionViewSet, 'positions')
router.register('employees', EmployeeViewSet, 'employees')
router.register('productTypes', ProductTypeViewSet, 'productTypes')
router.register('materials', MaterialViewSet, 'materials')
router.register('references', ReferenceViewSet, 'references')
router.register('purchaseOrders', PurchaseOrderViewSet, 'purchaseOrders')
router.register('payments', PaymentViewSet, 'payments')
router.register('poDetails', PODetailViewSet, 'poDetails')

urlpatterns = router.urls 