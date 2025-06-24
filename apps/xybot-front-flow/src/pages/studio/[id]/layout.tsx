import { useOutlet } from "react-router-dom";
import { StudioFlowModel } from "./StudioFlowModel";

export default () => {
  const outlet = useOutlet();
  return <StudioFlowModel.Provider>{outlet}</StudioFlowModel.Provider>;
};
