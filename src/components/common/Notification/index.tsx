import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../../store';
import { notification as antNotification } from 'antd';

export const Notification = observer(() => {
  const { notification, clearNotification } = useStore();
  const [notice, contextHolder] = antNotification.useNotification();

  useEffect(() => {
    if (notification.error) {
      notice.error({
        message: 'Ошибка',
        description: notification.error,
      });
    } else if (notification.success) {
      notice.success({
        message: 'Успешно',
        description: notification.success,
      });
    }

    return clearNotification();
  }, [notification.error, notification.success, notice, clearNotification]);

  return <>{contextHolder}</>;
});
