from django.urls import path
from . import views

urlpatterns = [
    path('accounts/', views.MetaAdAccountListView.as_view(), name='meta-account-list'),
    path('sync-accounts/', views.MetaSyncAccountsView.as_view(), name='meta-sync-accounts'),
    path('sync-campaigns/<int:account_id>/', views.MetaSyncCampaignsView.as_view(), name='meta-sync-campaigns'),
    path('campaigns/<int:account_id>/', views.MetaCampaignListView.as_view(), name='meta-campaign-list'),
]
