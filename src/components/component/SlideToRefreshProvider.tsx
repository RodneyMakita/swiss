// components/component/SlideToRefreshProvider.tsx
import React, { useState, useRef, useEffect } from 'react';
import '../component/styles.css'

interface SlideToRefreshProviderProps {
  children: React.ReactNode;
}

const SlideToRefreshProvider: React.FC<SlideToRefreshProviderProps> = ({ children }) => {
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchMoveY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current !== null) {
      touchMoveY.current = e.touches[0].clientY;
      if ((touchMoveY.current ?? 0) - (touchStartY.current ?? 0) > 100) {
        setRefreshing(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (refreshing) {
      // Perform refresh logic here
      setTimeout(() => {
        setRefreshing(false); // Hide loader after refresh
      }, 2000); // Simulate a refresh delay
    }
    touchStartY.current = null;
    touchMoveY.current = null;
  };

  useEffect(() => {
    const handleResize = () => {
      // Handle resize logic if needed
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      {refreshing && (
        <div className="loader" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <span>swiisspants</span>
          <span>swiisspants</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default SlideToRefreshProvider;
