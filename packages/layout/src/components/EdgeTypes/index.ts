import CustomEdge from "./CustomEdge";
import { EndflowEdge } from "./EndflowEdge";
import { PathsEdge } from "./PathsEdge";

export const edgeTypes = {
  pathsEdge: PathsEdge,
  endflowEdge: EndflowEdge,
  customEdge: CustomEdge,
};

export default edgeTypes;
