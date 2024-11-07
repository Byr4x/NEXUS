from rest_framework import routers
from .api import CustomerViewSet, PositionViewSet, EmployeeViewSet, ProductTypeViewSet, MaterialViewSet, ProductViewSet, ReferenceViewSet, PurchaseOrderViewSet, PaymentViewSet, PODetailViewSet, POChangeLogViewSet

router = routers.DefaultRouter()

router.register('customers', CustomerViewSet, 'customers')
router.register('positions', PositionViewSet, 'positions')
router.register('employees', EmployeeViewSet, 'employees')
router.register('productTypes', ProductTypeViewSet, 'productTypes')
router.register('materials', MaterialViewSet, 'materials')
router.register('products', ProductViewSet, 'products')
router.register('references', ReferenceViewSet, 'references')
router.register('purchaseOrders', PurchaseOrderViewSet, 'purchaseOrders')
router.register('payments', PaymentViewSet, 'payments')
router.register('poDetails', PODetailViewSet, 'poDetails')
router.register('poChangeLogs', POChangeLogViewSet, 'poChangeLogs')

urlpatterns = router.urls 