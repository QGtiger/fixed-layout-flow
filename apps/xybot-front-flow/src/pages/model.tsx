import { createCustomModel } from '@/common/createModel';
import { useBoolean } from 'ahooks';

export const ConsoleModel = createCustomModel(() => {
  const [hideConsoleMenu, hideConsoleMenuAction] = useBoolean(false);

  return {
    hideConsoleMenu,
    hideConsoleMenuAction,
  };
});
