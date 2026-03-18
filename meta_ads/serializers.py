from rest_framework import serializers
from .models import AdAccount, Campaign, AdSet, Ad

class AdAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdAccount
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'

class AdSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdSet
        fields = '__all__'

class AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = '__all__'
