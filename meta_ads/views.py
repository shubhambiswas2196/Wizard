from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import AdAccount, Campaign, AdSet, Ad
from .serializers import AdAccountSerializer, CampaignSerializer
from .services import MetaAdsService


def _resolve_org(request):
    """Return the organization from middleware or fall back to the user."""
    org = getattr(request, "organization", None)
    if org:
        return org
    user = getattr(request, "user", None)
    if user and user.is_authenticated:
        return getattr(user, "organization", None)
    return None

class MetaAdAccountListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        organization = _resolve_org(request)
        if not organization: 
            return Response({"error": "Organization not found."}, status=status.HTTP_400_BAD_REQUEST)
            
        accounts = AdAccount.objects.filter(organization=organization)
        serializer = AdAccountSerializer(accounts, many=True)
        return Response(serializer.data)

class MetaSyncAccountsView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_exempt)
    def post(self, request):
        organization = _resolve_org(request)
        if not organization:
            return Response({"error": "Organization not found."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            service = MetaAdsService()
        except ValueError as e:
            # Provide a clear 400 instead of a 500 when the token is missing
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        try:
            meta_accounts = service.get_ad_accounts()
            synced_accounts = []
            
            for acc in meta_accounts:
                obj, created = AdAccount.objects.update_or_create(
                    meta_account_id=acc['id'],
                    defaults={
                        'organization': organization,
                        'name': acc.get('name', 'Unnamed Account'),
                        'currency': acc.get('currency', 'USD'),
                    }
                )
                synced_accounts.append(AdAccountSerializer(obj).data)
                
            return Response({
                "message": f"Successfully synced {len(synced_accounts)} accounts.",
                "accounts": synced_accounts
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class MetaSyncCampaignsView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_exempt)
    def post(self, request, account_id):
        organization = _resolve_org(request)
        if not organization:
            return Response({"error": "Organization not found."}, status=status.HTTP_400_BAD_REQUEST)

        ad_account = get_object_or_404(AdAccount, id=account_id, organization=organization)
        try:
            service = MetaAdsService()
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            meta_campaigns = service.get_campaigns(ad_account.meta_account_id)
            synced_campaigns = []
            
            for camp in meta_campaigns:
                obj, created = Campaign.objects.update_or_create(
                    meta_campaign_id=camp['id'],
                    defaults={
                        'ad_account': ad_account,
                        'name': camp.get('name', 'Unnamed Campaign'),
                        'status': camp.get('status', 'UNKNOWN'),
                        'objective': camp.get('objective', ''),
                    }
                )
                
                try:
                    insights = service.get_insights(camp['id'])
                    if insights:
                        data = insights[0]
                        obj.spend = data.get('spend', 0)
                        obj.impressions = data.get('impressions', 0)
                        obj.clicks = data.get('clicks', 0)
                        obj.save()
                except:
                    pass
                    
                synced_campaigns.append(CampaignSerializer(obj).data)
                
            return Response({
                "message": f"Successfully synced {len(synced_campaigns)} campaigns for {ad_account.name}.",
                "campaigns": synced_campaigns
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)
class MetaCampaignListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, account_id):
        organization = _resolve_org(request)
        if not organization:
            return Response({"error": "Organization not found."}, status=status.HTTP_400_BAD_REQUEST)

        ad_account = get_object_or_404(AdAccount, id=account_id, organization=organization)
        campaigns = Campaign.objects.filter(ad_account=ad_account).order_by('-spend')
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)
