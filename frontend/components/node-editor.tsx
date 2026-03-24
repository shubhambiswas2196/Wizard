"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  applyEdgeChanges, 
  applyNodeChanges,
  Node,
  Edge,
  Connection,
  EdgeChange,
  NodeChange,
  ReactFlowProvider,
  Panel,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge, 
} from 'reactflow';
import 'reactflow/dist/style.css';

type MetaAccount = {
  id: number;
  meta_account_id: string;
  name: string;
  currency: string;
};

type MetaCampaign = {
  id: number;
  meta_campaign_id: string;
  name: string;
  status: string;
  spend?: string | number;
  impressions?: number;
  clicks?: number;
};

// --- Custom Edge with Plus Button ---

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: '#94a3b8', strokeWidth: 1.5 }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            display: 'flex',
            gap: '8px'
          }}
          className="nodrag nopan"
        >
          <button 
            style={{ 
              width: 20, 
              height: 20, 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '50%', 
              color: '#6366f1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onClick={(event) => {
              event.stopPropagation();
              console.log(`Add node at edge ${id}`);
            }}
            title="Add module"
          >
            +
          </button>
          <button 
            style={{ 
              width: 20, 
              height: 20, 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '50%', 
              color: '#94a3b8', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onClick={(event) => {
              event.stopPropagation();
              setEdges((eds) => eds.filter((e) => e.id !== id));
            }}
            title="Delete connection"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// --- Custom Node Components with Enterprise Aesthetic ---

const MagicNodeWrapper = ({ children, selected, title, icon, category, color, id, data }: any) => {
  const { setNodes } = useReactFlow();
  
  const onDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (data?.onDelete) {
      data.onDelete(id);
    }
  }, [id, data]);

  const accentColor = color || '#2563eb';

  return (
    <div className={`enterprise-node ${selected ? 'selected' : ''}`} style={{ 
      minWidth: '240px', 
      background: '#fff',
      border: `1px solid ${selected ? '#6366f1' : '#e2e8f0'}`,
      borderRadius: '10px',
      padding: '12px 14px',
      boxShadow: selected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 2px 5px rgba(0,0,0,0.03)',
      transition: 'all 0.15s ease',
      cursor: 'move',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* App Badge (Simplified) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '2px 8px', 
            borderRadius: '4px', 
            border: `1px solid ${accentColor === '#faad14' ? '#e2e8f0' : `${accentColor}40`}`,
            background: 'transparent',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: accentColor === '#faad14' ? '#64748b' : accentColor
          }}>
            <span style={{ fontSize: '0.9rem' }}>{icon}</span>
            <span>{category}</span>
          </div>

          {/* Optional Timer Badge (Simplified) */}
          {data.timer && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {data.timer}
            </div>
          )}
        </div>

        {/* Delete Icon (replaced ellipsis) */}
        <div 
          style={{ 
            color: '#94a3b8', 
            cursor: 'pointer', 
            fontSize: '18px', 
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px'
          }} 
          onClick={onDelete}
          title="Delete node"
        >
          ×
        </div>
      </div>

      {/* Body: Number and Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
          {data.index ? `${data.index}. ` : ''}{data.label || title}
        </div>
        {data.subtext && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
            {data.subtext}
          </div>
        )}
      </div>

      <div style={{ marginTop: 8 }}>
        {children}
      </div>
    </div>
  );
};

// Handle Styles matching reference
const handleStyle = { 
  width: '10px', 
  height: '10px', 
  background: '#fff', 
  border: '2px solid #6366f1',
  boxShadow: '0 0 0 2px #fff'
};

const TriggerNode = ({ data, selected, id }: any) => (
  <MagicNodeWrapper selected={selected} title="Trigger" icon="▶" category="Entry" color="#ef4444" id={id} data={data}>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </MagicNodeWrapper>
);

const FormulaNode = ({ data, selected, id }: any) => (
  <MagicNodeWrapper selected={selected} title="Formula" icon="fx" category="Calculations" color="#3b82f6" id={id} data={data}>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </MagicNodeWrapper>
);

const SwitchNode = ({ data, selected, id }: any) => (
  <MagicNodeWrapper selected={selected} title="Switch" icon="⇌" category="Conditions" color="#3b82f6" id={id} data={data}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </MagicNodeWrapper>
);

const ActionModuleNode = ({ data, selected, id }: any) => (
  <MagicNodeWrapper selected={selected} title="Add to sequence" icon="⚡" category="MixMax" color="#3b82f6" id={id} data={data}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </MagicNodeWrapper>
);

const MetaAccountNode = ({ data, selected, id }: any) => (
  <MagicNodeWrapper selected={selected} title="Meta Account" icon="A" category="Meta Ads" color="#0f766e" id={id} data={data}>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </MagicNodeWrapper>
);

const MetaCampaignNode = ({ data, selected, id }: any) => (
  <MagicNodeWrapper selected={selected} title="Meta Campaign" icon="C" category="Meta Ads" color="#2563eb" id={id} data={data}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </MagicNodeWrapper>
);

const MetaMetricNode = ({ data, selected, id }: any) => (
  <MagicNodeWrapper selected={selected} title="Campaign Metric" icon="Σ" category="Meta Ads" color="#7c3aed" id={id} data={data}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </MagicNodeWrapper>
);

const nodeTypes = {
  trigger: TriggerNode,
  formula: FormulaNode,
  switch: SwitchNode,
  actionModule: ActionModuleNode,
  metaAccount: MetaAccountNode,
  metaCampaign: MetaCampaignNode,
  metaMetric: MetaMetricNode,
};

const edgeTypes = {
  addButton: CustomEdge,
};

// --- End Custom Node Components ---

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    data: { label: 'New Lead Form Entry', index: 1, category: 'Google Ads', timer: '15 min' },
    position: { x: 400, y: 50 },
  },
  {
    id: '2',
    type: 'actionModule',
    data: { label: 'Create Spreadsheet Row', index: 2, category: 'Google Sheets (2.10.2)' },
    position: { x: 400, y: 300 },
  },
  {
    id: '3',
    type: 'actionModule',
    data: { label: 'Select the event', index: 3, category: 'Zapier Lead Router', subtext: 'Select the event', color: '#f97316' },
    position: { x: 400, y: 550 },
  },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', type: 'addButton' },
    { id: 'e2-3', source: '2', target: '3', type: 'addButton' }
];

let idCount = 100;
const getId = () => `node_${idCount++}`;

const NodeEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { setNodes: setFlowNodes, getNodes, getEdges } = useReactFlow();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  }, []);

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [workflowId, setWorkflowId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [accounts, setAccounts] = useState<MetaAccount[]>([]);
  const [campaignsByAccount, setCampaignsByAccount] = useState<Record<string, MetaCampaign[]>>({});

  const defaultEdgeOptions = useMemo(() => ({
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#cbd5e1', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#cbd5e1',
      width: 20,
      height: 20
    },
  }), []);

  // Load or Create Workflow
  React.useEffect(() => {
    const initWorkflow = async () => {
      try {
        const res = await fetch('/api/nodes/workflows/');
        const workflows = await res.json();
        
        if (workflows.length > 0) {
          const wf = workflows[0];
          setWorkflowId(wf.id);
          if (wf.nodes?.length > 0) {
              const mappedNodes = wf.nodes.map((n: any) => ({
                ...n,
                data: { ...n.data, onDelete: deleteNode }
              }));
              setNodes(mappedNodes);
              setEdges(wf.edges || []);
          }
        } else {
          const createRes = await fetch('/api/nodes/workflows/', {
            method: 'POST',
            body: JSON.stringify({ name: 'Primary Workflow', description: 'Default automation flow' }),
          });
          const newWf = await createRes.json();
          setWorkflowId(newWf.id);
        }
      } catch (err) {
        console.error("Failed to init workflow", err);
      } finally {
        setIsLoading(false);
      }
    };
    initWorkflow();
  }, []);

  // Load Meta Ads accounts and campaigns for palette
  useEffect(() => {
    const loadMeta = async () => {
      setIsMetaLoading(true);
      try {
        const accRes = await fetch('/api/meta-ads/accounts/');
        const accData = await accRes.json();
        if (Array.isArray(accData)) {
          setAccounts(accData as MetaAccount[]);
          const entries: Array<[string, MetaCampaign[]]> = [];
          for (const acc of accData) {
            try {
              const campRes = await fetch(`/api/meta-ads/campaigns/${acc.id}/`);
              const campData = await campRes.json();
              if (Array.isArray(campData)) {
                entries.push([acc.meta_account_id, campData as MetaCampaign[]]);
              }
            } catch (err) {
              console.error('Failed to load campaigns for account', acc.id, err);
            }
          }
          setCampaignsByAccount(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error('Failed to load Meta Ads data', err);
      } finally {
        setIsMetaLoading(false);
      }
    };
    loadMeta();
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, ...defaultEdgeOptions }, eds)),
    [defaultEdgeOptions]
  );

  const handleSave = async () => {
    if (!workflowId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/nodes/workflows/${workflowId}/sync`, {
        method: 'POST',
        body: JSON.stringify({ nodes, edges }),
      });
      if (res.ok) {
        // Subtle feedback
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const metaRaw = event.dataTransfer.getData('application/reactflow-data');
      let metaPayload: any = {};
      if (metaRaw) {
        try {
          metaPayload = JSON.parse(metaRaw);
        } catch (err) {
          console.error('Failed to parse drag payload', err);
        }
      }

      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const labelMap: Record<string, string> = {
        trigger: 'New Trigger',
        formula: 'Calculate logic',
        switch: 'Route data',
        actionModule: 'Execute task',
        metaAccount: metaPayload?.label || 'Meta Account',
        metaCampaign: metaPayload?.label || 'Meta Campaign',
        metaMetric: metaPayload?.label || 'Metric check',
      };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { 
          label: labelMap[type] || 'New Module', 
          index: getNodes().length + 1,
          subtext: type === 'actionModule' ? 'Select the event' : '',
          ...metaPayload, 
          onDelete: deleteNode 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, getId, deleteNode, getNodes]
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    event.preventDefault();
    const selectedNodeIds = getNodes().filter((n: any) => n.selected).map((n: any) => n.id);
    const selectedEdgeIds = getEdges().filter((e: any) => e.selected).map((e: any) => e.id);
    if (selectedNodeIds.length) {
      setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
    }
    if (selectedEdgeIds.length) {
      setEdges((eds) => eds.filter((e) => !selectedEdgeIds.includes(e.id)));
    }
  }, [getNodes, getEdges]);

  if (isLoading) {
      return (
          <div style={{ height: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                color: 'var(--primary)', 
                fontWeight: '800', 
                fontSize: '1.2rem', 
                letterSpacing: '-0.02em'
              }}>Summoning your editor...</div>
          </div>
      );
  }

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', background: '#F9F7F3' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div
          ref={reactFlowWrapper}
          style={{ height: '100%', width: '100%' }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ 
              ...defaultEdgeOptions,
              type: 'addButton'
            }}
            fitView
          >
            <Background color="#cbd5e1" variant={'dots' as any} gap={30} size={1} />
            <Controls style={{ 
                left: 16, 
                bottom: 16, 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '4px', 
                background: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                padding: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }} showInteractive={false} showZoom={true} />
            

            <Panel position="top-left">
              <button 
                className="btn-black" 
                onClick={handleSave} 
                disabled={isSaving}
                style={{ 
                  padding: '8px 24px', 
                  fontSize: '0.85rem', 
                  fontWeight: '700',
                  background: isSaving ? 'var(--muted)' : 'black',
                  boxShadow: '0 10px 25px -10px rgba(0,0,0,0.3)',
                }}
              >
                {isSaving ? 'Saving...' : 'Save Flow ✨'}
              </button>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      <div style={{ width: '260px', borderLeft: '1px solid #e2e8f0', background: '#fff', padding: '16px', overflowY: 'auto' }}>
        <div style={{ 
            fontWeight: '800', 
            fontSize: '0.7rem', 
            color: '#64748b', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            marginBottom: '12px',
            textAlign: 'center'
        }}>Modules</div>
        
        {[
          { type: 'trigger', label: 'Trigger', icon: '▶', color: '#ef4444' },
          { type: 'formula', label: 'Formula', icon: 'fx', color: '#3b82f6' },
          { type: 'switch', label: 'Switch', icon: '⇌', color: '#3b82f6' },
          { type: 'actionModule', label: 'Module', icon: '⚡', color: '#3b82f6' }
        ].map((item) => (
          <div 
            key={item.type}
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', item.type);
              event.dataTransfer.effectAllowed = 'move';
            }} 
            draggable
            style={{ 
              cursor: 'grab', 
              padding: '10px 14px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              fontSize: '0.85rem', 
              background: '#fff', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              marginBottom: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = item.color;
              e.currentTarget.style.background = `${item.color}05`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#fff';
            }}
          >
            <div style={{ 
                width: '24px', 
                height: '24px', 
                background: `${item.color}15`, 
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                fontSize: '0.8rem'
            }}>{item.icon}</div>
            {item.label}
          </div>
        ))}

        <div style={{ 
            fontWeight: '800', 
            fontSize: '0.7rem', 
            color: '#0f766e', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            margin: '12px 0 6px'
        }}>Meta Ads</div>
        {isMetaLoading && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Loading accounts…</div>}
        {!isMetaLoading && accounts.length === 0 && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No accounts synced yet.</div>
        )}
        {!isMetaLoading && accounts.map((acc) => (
          <div
            key={acc.id}
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'metaAccount');
              event.dataTransfer.setData('application/reactflow-data', JSON.stringify({
                meta: {
                  accountId: acc.meta_account_id,
                  accountName: acc.name,
                  currency: acc.currency,
                },
                label: acc.name,
              }));
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
            style={{ 
              cursor: 'grab', 
              padding: '10px 14px', 
              border: '1px solid #0f766e33', 
              borderRadius: '12px', 
              fontSize: '0.85rem', 
              background: '#ecfeff', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              marginBottom: '8px'
            }}
          >
            <span>{acc.name}</span>
            <span style={{ fontSize: '0.75rem', color: '#0f766e' }}>{acc.currency}</span>
          </div>
        ))}
        {!isMetaLoading && accounts.map((acc) => (
          <div key={`camp-${acc.id}`} style={{ marginLeft: '4px' }}>
            <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '6px', marginBottom: '4px', fontWeight: 700 }}>
              Campaigns – {acc.name}
            </div>
            {(campaignsByAccount[acc.meta_account_id] || []).slice(0, 6).map((camp) => (
              <div
                key={camp.id}
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', 'metaCampaign');
                  event.dataTransfer.setData('application/reactflow-data', JSON.stringify({
                    meta: {
                      campaignId: camp.meta_campaign_id,
                      campaignName: camp.name,
                      status: camp.status,
                      spend: camp.spend,
                      accountId: acc.meta_account_id,
                    },
                    label: camp.name,
                  }));
                  event.dataTransfer.effectAllowed = 'move';
                }}
                draggable
                style={{ 
                  cursor: 'grab', 
                  padding: '8px 12px', 
                  border: '1px solid #2563eb33', 
                  borderRadius: '10px', 
                  fontSize: '0.8rem', 
                  background: '#eff6ff', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{camp.name}</span>
                <span style={{ fontSize: '0.7rem', color: '#2563eb' }}>{(camp.status || '').toLowerCase()}</span>
              </div>
            ))}
            {(campaignsByAccount[acc.meta_account_id] || []).length === 0 && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No campaigns</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function NodeEditorProvider() {
  return (
    <ReactFlowProvider>
      <NodeEditor />
    </ReactFlowProvider>
  );
}
