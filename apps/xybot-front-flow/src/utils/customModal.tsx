import type { ModalFuncProps } from 'antd';
import type { HookAPI } from 'antd/es/modal/useModal';

export const ModalRef = {
  current: undefined as unknown as HookAPI,
  modalInsList: [] as { destroy: () => void }[],
};

export function createModal(config: ModalFuncProps) {
  // 路由拦截，不让跳转
  const ins = ModalRef.current.confirm({
    ...config,
  });
  ModalRef.modalInsList.push(ins);
  return ins;
}
