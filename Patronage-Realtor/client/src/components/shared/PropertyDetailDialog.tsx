import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import type { Property } from "@/lib/propertyStore";
import { Bath, Bed, MapPin, Square } from "lucide-react";

export type PropertyDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property;
  onEdit?: (id: string) => void;
};

export function PropertyDetailDialog({
  open,
  onOpenChange,
  property,
  onEdit,
}: PropertyDetailDialogProps) {
  if (!property) return null;

  const imageUrl = property.images?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative bg-muted/20">
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm">
                {property.status}
              </Badge>
            </div>

            <div className="h-64 md:h-full w-full">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={property.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <PlaceholderImage
                  height="h-full"
                  text="Property Image"
                  className="rounded-none"
                />
              )}
            </div>
          </div>

          <ScrollArea className="h-[70vh] md:h-[560px]">
            <div className="p-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-heading">
                  {property.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Price
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {property.price}
                  </p>
                </div>
                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={() => onEdit(property.id)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  <span>{property.beds} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4" />
                  <span>{property.baths} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>

              {property.description && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Overview
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {property.description}
                    </p>
                  </div>
                </>
              )}

              {property.amenities?.length ? (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((a) => (
                        <Badge key={a} variant="secondary">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              {property.highlights?.length ? (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Highlights
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
                      {property.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

