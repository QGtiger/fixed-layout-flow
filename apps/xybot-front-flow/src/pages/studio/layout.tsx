import { useOutlet } from "react-router-dom";
import { useHideConsoleMenu } from "../model";

export default function StudioLayout() {
  const outlet = useOutlet();
  useHideConsoleMenu();
  return <div>{outlet}</div>;
}
