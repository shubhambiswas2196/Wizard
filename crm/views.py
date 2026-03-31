from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import PermissionDenied
from .models import Lead, Deal, CustomFieldDefinition
from .serializers import LeadSerializer, DealSerializer, CustomFieldDefinitionSerializer

class TenantViewSetMixin:
    """
    Mixin to ensure all requests and creates are isolated to the current organization.
    """
    def get_queryset(self):
        org = getattr(self.request, 'organization', None)
        if not org:
            return self.queryset.none()
        return self.queryset.filter(organization=org)

    def perform_create(self, serializer):
        org = getattr(self.request, 'organization', None)
        if org:
            serializer.save(organization=org)
        else:
            raise PermissionDenied("Organization context missing for this request.")

class CustomFieldDefinitionViewSet(TenantViewSetMixin, viewsets.ModelViewSet):
    queryset = CustomFieldDefinition.objects.all()
    serializer_class = CustomFieldDefinitionSerializer
    permission_classes = [permissions.IsAuthenticated]

class LeadViewSet(TenantViewSetMixin, viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'company', 'phone']

class DealViewSet(TenantViewSetMixin, viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated]
