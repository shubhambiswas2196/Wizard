from django.db import models
from accounts.models import Organization

class CustomFieldDefinition(models.Model):
    FIELD_TYPES = [
        ('TEXT', 'Text'),
        ('NUMBER', 'Number'),
        ('DATE', 'Date'),
        ('CHECKBOX', 'Checkbox'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='custom_field_definitions')
    label = models.CharField(max_length=100)
    name = models.SlugField(max_length=100) # Internal identifier (e.g., 'lead_score')
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES, default='TEXT')
    is_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('organization', 'name')

    def __str__(self):
        return f"{self.label} ({self.organization.name})"

class Lead(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('QUALIFIED', 'Qualified'),
        ('LOST', 'Lost'),
    ]

    SOURCE_CHOICES = [
        ('WEB', 'Website'),
        ('REFERRAL', 'Referral'),
        ('COLD_CALL', 'Cold Call'),
        ('ADS', 'Advertising'),
        ('OTHER', 'Other'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='leads')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    
    company = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, default='USA')
    website = models.URLField(blank=True, null=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='WEB')
    assigned_to = models.CharField(max_length=100, blank=True, null=True)
    
    # Dynamic data storage
    custom_fields = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.organization.name})"

class Deal(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('WON', 'Closed Won'),
        ('LOST', 'Closed Lost'),
    ]

    STAGE_CHOICES = [
        ('PROSPECTING', 'Prospecting'),
        ('QUALIFICATION', 'Qualification'),
        ('PROPOSAL', 'Proposal'),
        ('NEGOTIATION', 'Negotiation'),
        ('CLOSING', 'Closing'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='deals')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='deals')
    name = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='PROSPECTING')
    probability = models.IntegerField(default=10) # percentage
    expected_close_date = models.DateField(blank=True, null=True)
    
    # Dynamic data storage
    custom_fields = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - ${self.value} ({self.organization.name})"
