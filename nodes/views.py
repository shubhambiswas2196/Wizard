from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Workflow, WorkflowNode, WorkflowEdge
from .serializers import WorkflowSerializer
from django.db import transaction
from meta_ads.models import AdAccount, Campaign as MetaCampaign

class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Workflow.objects.filter(organization=self.request.user.organization)
        return Workflow.objects.none()

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=['post'])
    def sync_graph(self, request, pk=None):
        workflow = self.get_object()
        nodes_data = request.data.get('nodes', [])
        edges_data = request.data.get('edges', [])
        org = getattr(request.user, "organization", None)

        # Validate referenced Meta objects belong to the same org
        if org:
            account_ids = {
                node.get('data', {}).get('meta', {}).get('accountId')
                for node in nodes_data
            }
            account_ids.discard(None)
            if account_ids:
                missing_accounts = account_ids - set(
                    AdAccount.objects.filter(organization=org, meta_account_id__in=account_ids)
                    .values_list('meta_account_id', flat=True)
                )
                if missing_accounts:
                    return Response(
                        {"error": "Unknown Meta accounts in workflow.", "missing_accounts": list(missing_accounts)},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            campaign_ids = {
                node.get('data', {}).get('meta', {}).get('campaignId')
                for node in nodes_data
            }
            campaign_ids.discard(None)
            if campaign_ids:
                missing_campaigns = campaign_ids - set(
                    MetaCampaign.objects.filter(ad_account__organization=org, meta_campaign_id__in=campaign_ids)
                    .values_list('meta_campaign_id', flat=True)
                )
                if missing_campaigns:
                    return Response(
                        {"error": "Unknown Meta campaigns in workflow.", "missing_campaigns": list(missing_campaigns)},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        with transaction.atomic():
            # Clear existing graph for this workflow to simplify sync
            # In a real high-perf app, we'd do diffing, but for MVP this is robust
            workflow.nodes.all().delete()
            workflow.edges.all().delete()

            # Create new nodes
            for node_data in nodes_data:
                WorkflowNode.objects.create(
                    workflow=workflow,
                    node_id=node_data.get('id'),
                    type=node_data.get('type', 'default'),
                    position_x=node_data.get('position', {}).get('x', 0),
                    position_y=node_data.get('position', {}).get('y', 0),
                    data=node_data.get('data', {})
                )

            # Create new edges
            for edge_data in edges_data:
                WorkflowEdge.objects.create(
                    workflow=workflow,
                    edge_id=edge_data.get('id'),
                    source_node=edge_data.get('source'),
                    target_node=edge_data.get('target'),
                    source_handle=edge_data.get('sourceHandle'),
                    target_handle=edge_data.get('targetHandle')
                )

        return Response({"status": "synced"}, status=status.HTTP_200_OK)
