import { useOutlet } from "react-router-dom";
import { useHideConsoleMenu } from "../model";
import Header from "./components/Header";

export default function StudioLayout() {
  const outlet = useOutlet();
  useHideConsoleMenu();
  return (
    <div className=" h-full relative">
      <div className=" absolute top-0 left-0 right-0 z-10">
        <Header />
      </div>
      {outlet}
    </div>
  );
}
