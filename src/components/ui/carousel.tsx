import React from 'react';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, className }) => {
  return (
    <div className={`carousel ${className}`}>
      {children}
    </div>
  );
};

interface CarouselContentProps {
  children: React.ReactNode;
}

export const CarouselContent: React.FC<CarouselContentProps> = ({ children }) => {
  return <div className="carousel-content">{children}</div>;
};

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({ children, className }) => {
  return <div className={`carousel-item ${className}`}>{children}</div>;
};

export const CarouselPrevious: React.FC = () => {
  return <button className="carousel-prev">Previous</button>;
};

export const CarouselNext: React.FC = () => {
  return <button className="carousel-next">Next</button>;
};
