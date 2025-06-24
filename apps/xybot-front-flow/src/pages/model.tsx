import { createCustomModel } from "@/common/createModel";
import { useBoolean } from "ahooks";
import { useLayoutEffect } from "react";

export const ConsoleModel = createCustomModel(() => {
  const [hideConsoleMenu, hideConsoleMenuAction] = useBoolean(false);

  return {
    hideConsoleMenu,
    hideConsoleMenuAction,
  };
});

export function useHideConsoleMenu() {
  const { hideConsoleMenuAction } = ConsoleModel.useModel();
  useLayoutEffect(() => {
    hideConsoleMenuAction.setTrue();
    return () => {
      hideConsoleMenuAction.setFalse();
    };
  }, []);
}
