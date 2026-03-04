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
        className={`horizontal-scroll w-full scroll-smooth ${className ?? ""}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
