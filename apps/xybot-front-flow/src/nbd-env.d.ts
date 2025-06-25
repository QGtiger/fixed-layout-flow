/// <reference path="./.xybot/env.d.ts"/>

declare module "*.svg?react" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;

  export default ReactComponent;
}

interface Window {
  rawWindow: Window;
  __MICRO_APP_ENVIRONMENT__?: boolean;
}
