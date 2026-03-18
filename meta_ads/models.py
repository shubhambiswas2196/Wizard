from django.db import models
from accounts.models import Organization

class AdAccount(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='ad_accounts')
    meta_account_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    currency = models.CharField(max_length=10, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.meta_account_id})"

class Campaign(models.Model):
    ad_account = models.ForeignKey(AdAccount, on_delete=models.CASCADE, related_name='campaigns')
    meta_campaign_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    objective = models.CharField(max_length=100, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    stop_time = models.DateTimeField(null=True, blank=True)
    daily_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    lifetime_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Insights (Summary)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    spend = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class AdSet(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='ad_sets')
    meta_adset_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Ad(models.Model):
    ad_set = models.ForeignKey(AdSet, on_delete=models.CASCADE, related_name='ads')
    meta_ad_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
