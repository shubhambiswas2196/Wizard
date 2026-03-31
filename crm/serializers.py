from rest_framework import serializers
from .models import Lead, Deal, CustomFieldDefinition
from accounts.models import Organization

class CustomFieldDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomFieldDefinition
        fields = ['id', 'label', 'name', 'field_type', 'is_required', 'created_at']
        read_only_fields = ['id', 'created_at']

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'email', 'phone', 'status', 
            'company', 'address', 'city', 'state', 'zip_code', 
            'country', 'website', 'source', 'assigned_to',
            'custom_fields',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class DealSerializer(serializers.ModelSerializer):
    lead_name = serializers.ReadOnlyField(source='lead.name')

    class Meta:
        model = Deal
        fields = [
            'id', 'lead', 'lead_name', 'name', 'value', 'status', 
            'stage', 'probability', 'expected_close_date',
            'custom_fields',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
