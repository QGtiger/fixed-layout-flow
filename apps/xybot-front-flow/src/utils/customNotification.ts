import { notification } from 'antd';
import { ArgsProps, NotificationInstance } from 'antd/es/notification/interface';

export const NotificationRef = {
  current: notification as unknown as NotificationInstance,
  queueList: [] as any[],
};

export function createNotification(config: ArgsProps) {
  return NotificationRef.current.open(config);
}
