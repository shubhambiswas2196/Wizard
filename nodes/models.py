from django.db import models
from accounts.models import Organization

class Workflow(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='workflows')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.organization.name})"

class WorkflowNode(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='nodes')
    node_id = models.CharField(max_length=100) # React Flow ID
    type = models.CharField(max_length=50, default='default')
    position_x = models.FloatField()
    position_y = models.FloatField()
    data = models.JSONField(default=dict) # For storage of custom data

    def __str__(self):
        return f"Node {self.node_id} in {self.workflow.name}"

class WorkflowEdge(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='edges')
    edge_id = models.CharField(max_length=100) # React Flow ID
    source_node = models.CharField(max_length=100) # Source React Flow ID
    target_node = models.CharField(max_length=100) # Target React Flow ID
    source_handle = models.CharField(max_length=100, null=True, blank=True)
    target_handle = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Edge {self.edge_id} in {self.workflow.name}"
