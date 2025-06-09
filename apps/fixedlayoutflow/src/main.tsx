import { ErrorBoundary } from "react-error-boundary";
import { createRoot } from "react-dom/client";

import { FixedFlowLayout, type FixedFlowBlocks } from "@fixedflow/layout";
import "@fixedflow/layout/styles.css";

import "./index.css";

const blocks: FixedFlowBlocks = [
  {
    id: "1",
    type: "custom",
    data: { label: "Start Block" },
    blocks: [],
  },
];

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <div
      style={{
        height: "100vh",
      }}
    >
      <FixedFlowLayout initialBlocks={blocks} />
    </div>
  </ErrorBoundary>
);
