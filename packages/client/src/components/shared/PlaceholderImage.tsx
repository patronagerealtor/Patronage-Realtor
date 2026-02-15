import { Image } from "lucide-react";

interface PlaceholderImageProps {
  height?: string;
  width?: string;
  text?: string;
  className?: string;
}

export function PlaceholderImage({ height = "h-64", width = "w-full", text = "Image Placeholder", className = "" }: PlaceholderImageProps) {
  return (
    <div className={`bg-secondary flex flex-col items-center justify-center text-muted-foreground ${height} ${width} ${className} border-2 border-dashed border-muted-foreground/20 rounded-lg overflow-hidden relative group`}>
      <div className="absolute inset-0 bg-secondary/50 pattern-grid-lg opacity-10" />
      <Image className="w-12 h-12 mb-2 opacity-50" />
      <span className="text-sm font-medium uppercase tracking-wider">{text}</span>
    </div>
  );
}
