import type { NotificationInstance } from 'antd/es/notification/interface';
let notificationApi: NotificationInstance | null = null;
export function setNotificationApi(api: NotificationInstance) {
  notificationApi = api;
}
type NotificationType = 'success' | 'info' | 'warning' | 'error';
export function showNotification(
  type: NotificationType,
  title: string,
  description: string,
  placement: 'topRight' | 'topLeft' | 'bottomLeft' | 'bottomRight' = 'topRight'
) {
  if (!notificationApi) {
    console.warn('Notification API not initialized');
    return;
  }

  notificationApi[type]({
    message: title,
    description,
    placement,
  });
}
