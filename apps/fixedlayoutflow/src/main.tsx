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
  {
    id: "2",
    type: "custom",
    data: { label: "Start Block" },
    blocks: [],
  },
  {
    id: "3",
    type: "paths",
    data: { label: "Paths Block" },
    blocks: [
      {
        id: "3-1",
        type: "pathRule",
        data: { label: "Child Block 1" },
        blocks: [],
      },
      {
        id: "3-2",
        type: "pathRule",
        data: { label: "Child Block 2" },
        blocks: [],
      },
    ],
  },
];

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <div
      style={{
        height: "100vh",
      }}
    >
      <FixedFlowLayout initialBlocks={blocks} pathRuleInsertIndex={-1} />
    </div>
  </ErrorBoundary>
);
