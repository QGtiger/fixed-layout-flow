import { useRef } from "react";
import {
  createFixedLayoutModelStore,
  FixedLayoutModelConfig,
  FixedLayoutStoreType,
  StoreContext,
} from "./model";
import useFixedLayoutStore from "./hooks/useFixedLayoutStore";
import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import nodeTypes from "./components/NodeTypes";

import "./index.css";

function FixedFlow() {
  const { nodes, edges } = useFixedLayoutStore();
  console.log("nodes", nodes);
  console.log("edges", edges);
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodesConnectable={false}
        zoomOnDoubleClick={false}
        deleteKeyCode={null}
        nodesDraggable={false}
        nodeTypes={nodeTypes}
      >
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export function FixedFlowLayout({ initialBlocks }: FixedLayoutModelConfig) {
  const storeRef = useRef<FixedLayoutStoreType>(null);

  if (!storeRef.current) {
    storeRef.current = createFixedLayoutModelStore({
      initialBlocks,
    });
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      <FixedFlow />
    </StoreContext.Provider>
  );
}

export * from "@/type";
