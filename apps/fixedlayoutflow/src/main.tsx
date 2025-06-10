import { ErrorBoundary } from "react-error-boundary";
import { createRoot } from "react-dom/client";

import "./index.css";
import IndexPage from "./pages";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <div
      style={{
        height: "100vh",
      }}
    >
      <IndexPage />
    </div>
  </ErrorBoundary>
);
