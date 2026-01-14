import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  notification: string;
  showNotification: (msg: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {notification && <div className="notification">{notification}</div>}
      {children}
    </NotificationContext.Provider>
  );
};
