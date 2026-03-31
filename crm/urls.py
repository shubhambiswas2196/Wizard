from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, DealViewSet, CustomFieldDefinitionViewSet

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'custom-fields', CustomFieldDefinitionViewSet, basename='custom-field')

urlpatterns = [
    path('api/', include(router.urls)),
]
