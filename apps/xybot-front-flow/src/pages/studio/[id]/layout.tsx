import { useOutlet } from "react-router-dom";
import { StudioFlowModel } from "./StudioFlowModel";
import { IPaaSModel } from "./IPaaSModel";

export default () => {
  const outlet = useOutlet();
  return (
    <IPaaSModel.Provider>
      <StudioFlowModel.Provider>{outlet}</StudioFlowModel.Provider>
    </IPaaSModel.Provider>
  );
};
