import { notification } from 'antd';

export const message = {
  success: (message, duration) => {
    notification.open({
      message: '',
      description: message,
      duration: duration || 2,
      className: 'messageSuccess'
    });
  },
  error: (message, duration) => {
    notification.open({
      message: '',
      description: message,
      duration: duration || 2,
      className: 'messageError'
    });
  },
  warning: (message, duration) => {
    notification.open({
      message: '',
      description: message,
      duration: duration || 2,
      className: 'messageWarning'
    });
  }
};
