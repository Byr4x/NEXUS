from rest_framework import routers
from .api import SupplierViewSet, RawMaterialViewSet, MachineViewSet, WorkOrderViewSet, ExtrusionViewSet, R_RawMaterial_ExtrusionViewSet, PrintingViewSet, SealingViewSet, HandicrafViewSet, WOChangeLogViewSet, TouchViewSet, TouchDetailsViewSet

router = routers.DefaultRouter()

router.register('suppliers', SupplierViewSet, 'suppliers')
router.register('rawMaterials', RawMaterialViewSet, 'rawMaterial')
router.register('machines', MachineViewSet, 'machines')
router.register('workOrders', WorkOrderViewSet, 'workOrders')
router.register('extrusions', ExtrusionViewSet, 'extrusions')
router.register('meQuantity', R_RawMaterial_ExtrusionViewSet, 'meQuantity')
router.register('printings', PrintingViewSet, 'printings')
router.register('sealings', SealingViewSet, 'sealings')
router.register('handicrafts', HandicrafViewSet, 'handicrafts')
router.register('woChangeLogs', WOChangeLogViewSet, 'woChangeLogs')
router.register('touchs', TouchViewSet, 'touchs')
router.register('touchDetails', TouchDetailsViewSet, 'touchDetails')

urlpatterns = router.urls 