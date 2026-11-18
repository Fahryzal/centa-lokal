import { notification } from 'antd';
import { setNotificationApi } from '../services/notificationService';
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();
  setNotificationApi(api);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};
