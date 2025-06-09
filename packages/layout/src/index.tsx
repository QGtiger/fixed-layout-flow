import { useRef } from "react";
import {
  createFixedLayoutModelStore,
  FixedLayoutModelConfig,
  FixedLayoutStoreType,
  StoreContext,
} from "./model";
import useFixedLayoutStore from "./hooks/useFixedLayoutStore";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";

import nodeTypes from "./components/NodeTypes";

import { useMount } from "ahooks";

import "./reset.css";
import "@xyflow/react/dist/style.css";
import edgeTypes from "./components/EdgeTypes";

function FixedFlow() {
  const { nodes, edges } = useFixedLayoutStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setCenter, getNode, getNodesBounds, getViewport } = useReactFlow();
  console.log("nodes", nodes);
  console.log("edges", edges);

  useMount(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      const { height } = wrapper.getBoundingClientRect();
      setCenter(0, height / 2 - 200, {
        zoom: 1,
      });
    }
  });
  return (
    <div
      className="fixed-flow-wrapper"
      style={{ width: "100%", height: "100%" }}
    >
      <div ref={wrapperRef} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodesConnectable={false}
          zoomOnDoubleClick={false}
          deleteKeyCode={null}
          nodesDraggable={false}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export function FixedFlowLayout(props: FixedLayoutModelConfig) {
  const { initialBlocks } = props;
  const storeRef = useRef<FixedLayoutStoreType>(null);

  if (!storeRef.current) {
    storeRef.current = createFixedLayoutModelStore(props);
  }
  return (
    <ReactFlowProvider>
      <StoreContext.Provider value={storeRef.current}>
        <FixedFlow />
      </StoreContext.Provider>
    </ReactFlowProvider>
  );
}

export * from "@/type";
