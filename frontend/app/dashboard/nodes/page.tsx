import React from "react";
import NodeEditor from "@/components/node-editor";

export default function NodesPage() {
  return (
    <div style={{ height: 'calc(100vh - 72px)', width: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: '100%' }}>
        <NodeEditor />
      </div>
    </div>
  );
}
