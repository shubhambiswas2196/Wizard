import os
import requests
from django.conf import settings

class MetaAdsService:
    BASE_URL = "https://graph.facebook.com/v19.0"

    def __init__(self, access_token=None):
        self.access_token = access_token or os.environ.get("META_ACCESS_TOKEN")
        if not self.access_token:
            raise ValueError("Meta Access Token is not configured.")

    def get_ad_accounts(self):
        """Fetch all ad accounts associated with the token."""
        url = f"{self.BASE_URL}/me/adaccounts"
        params = {
            "fields": "id,name,currency,account_status",
            "access_token": self.access_token
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json().get("data", [])

    def get_campaigns(self, ad_account_id):
        """Fetch campaigns for a specific ad account."""
        url = f"{self.BASE_URL}/{ad_account_id}/campaigns"
        params = {
            "fields": "id,name,status,objective,start_time,stop_time,daily_budget,lifetime_budget",
            # Request a broader set of statuses so archived/paused campaigns are included
            "effective_status": '["ACTIVE","PAUSED","ARCHIVED","IN_PROCESS","PENDING_REVIEW","DISAPPROVED"]',
            "limit": 500,
            "access_token": self.access_token
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json().get("data", [])

    def get_insights(self, object_id):
        """Fetch insights (spend, impressions, clicks) for an object (account, campaign, etc.)."""
        url = f"{self.BASE_URL}/{object_id}/insights"
        params = {
            "fields": "spend,impressions,clicks",
            "access_token": self.access_token
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json().get("data", [])
