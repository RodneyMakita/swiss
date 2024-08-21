import React, { createContext, useContext, useState } from 'react';

type ToastVariant = 'default' | 'destructive';

interface ToastContextType {
  toast: (options: { title: string; description: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<{ title: string; description: string; variant?: ToastVariant }[]>([]);

  const toast = (options: { title: string; description: string; variant?: ToastVariant }) => {
    setToasts((prev) => [...prev, options]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000); // Auto-dismiss after 3 seconds
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-white ${t.variant === 'destructive' ? 'bg-red-500' : 'bg-gray-800'}`}
          >
            <strong>{t.title}</strong>
            <p>{t.description}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
