from rest_framework import serializers
from .models import Workflow, WorkflowNode, WorkflowEdge

class WorkflowNodeSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='node_id')
    
    class Meta:
        model = WorkflowNode
        fields = ['id', 'type', 'position_x', 'position_y', 'data']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # React Flow expects position as an object { x, y }
        ret['position'] = {'x': ret.pop('position_x'), 'y': ret.pop('position_y')}
        return ret

class WorkflowEdgeSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='edge_id')
    source = serializers.CharField(source='source_node')
    target = serializers.CharField(source='target_node')

    class Meta:
        model = WorkflowEdge
        fields = ['id', 'source', 'target', 'source_handle', 'target_handle']

class WorkflowSerializer(serializers.ModelSerializer):
    nodes = WorkflowNodeSerializer(many=True, read_only=True)
    edges = WorkflowEdgeSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = ['id', 'name', 'description', 'nodes', 'edges', 'created_at', 'updated_at']
