import { forwardRef } from "react";

interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const HorizontalScroll = forwardRef<HTMLDivElement, HorizontalScrollProps>(
  function HorizontalScroll({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`horizontal-scroll flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory ${className ?? ""}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
