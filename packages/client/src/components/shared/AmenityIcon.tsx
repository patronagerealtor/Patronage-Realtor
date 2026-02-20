import * as Icons from "lucide-react";

export function AmenityIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = Icons[name as keyof typeof Icons];
  return IconComponent ? (
    <IconComponent className={className} />
  ) : null;
}
