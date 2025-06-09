import CustomEdge from "./CustomEdge";
import { EndflowEdge } from "./EndflowEdge";
import LoopCloseEdge from "./LoopCloseEdge";
import LoopInnerEdge from "./LoopInnerEdge";
import { PathsEdge } from "./PathsEdge";

export const edgeTypes = {
  pathsEdge: PathsEdge,
  endflowEdge: EndflowEdge,
  customEdge: CustomEdge,
  loopInnerEdge: LoopInnerEdge,
  loopCloseEdge: LoopCloseEdge,
};

export default edgeTypes;
