import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { Property, PropertyStatus } from "../../lib/propertyStore";

const STATUS_OPTIONS: PropertyStatus[] = [
  "For Sale",
  "For Rent",
  "Coming Soon",
  "Sold",
];

function parseLines(val: string) {
  return val
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCsv(val: string) {
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ImageFilePreview({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!src) return null;
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
      <img src={src} alt="" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Remove image"
      >
        <span className="text-xs font-bold">×</span>
      </button>
    </div>
  );
}

export type PropertyFormPayload = {
  title: string;
  status: PropertyStatus;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  description: string;
  /** Existing image URLs to keep (when editing). */
  existingImageUrls: string[];
  /** New files to upload to Supabase Storage. */
  filesToUpload: File[];
  amenities: string[];
  highlights: string[];
  developer: string;
  property_type: string;
  city: string;
  possession_date: string;
  latitude: string;
  longitude: string;
  price_value: string;
  slug: string;
};

export type PropertyFormProps = {
  editingProperty: Property | null;
  editingId: string | null;
  onSave: (payload: PropertyFormPayload) => Promise<string>;
  onReset: () => void;
  isMutating: boolean;
  onLoadSample?: () => void;
  onPreview?: () => void;
  previewDisabled?: boolean;
};

export function PropertyForm({
  editingProperty,
  editingId,
  onSave,
  onReset,
  isMutating,
  onLoadSample,
  onPreview,
  previewDisabled = true,
}: PropertyFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PropertyStatus>("For Sale");
  const [price, setPrice] = useState("");
  const [locationText, setLocationText] = useState("");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [developer, setDeveloper] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [possessionDate, setPossessionDate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [slug, setSlug] = useState("");

  const fillFormFromProperty = (p: Property) => {
    setTitle(p.title ?? "");
    setStatus(p.status ?? "For Sale");
    setPrice(p.price ?? "");
    setLocationText(p.location ?? "");
    setBeds(Number(p.beds ?? 0));
    setBaths(Number(p.baths ?? 0));
    setSqft(p.sqft ?? "");
    setDescription(p.description ?? "");
    setExistingImageUrls(p.images ?? []);
    setFilesToUpload([]);
    setAmenitiesText((p.amenities ?? []).join(", "));
    setHighlightsText((p.highlights ?? []).join(", "));
    setDeveloper(p.developer ?? "");
    setPropertyType(p.property_type ?? "");
    setCity(p.city ?? "");
    setPossessionDate(p.possession_date ?? "");
    setLatitude(p.latitude != null ? String(p.latitude) : "");
    setLongitude(p.longitude != null ? String(p.longitude) : "");
    setPriceValue(p.price_value != null ? String(p.price_value) : "");
    setSlug(p.slug ?? "");
  };

  const resetForm = () => {
    setTitle("");
    setStatus("For Sale");
    setPrice("");
    setLocationText("");
    setBeds(0);
    setBaths(0);
    setSqft("");
    setDescription("");
    setExistingImageUrls([]);
    setFilesToUpload([]);
    setAmenitiesText("");
    setHighlightsText("");
    setDeveloper("");
    setPropertyType("");
    setCity("");
    setPossessionDate("");
    setLatitude("");
    setLongitude("");
    setPriceValue("");
    setSlug("");
    onReset();
  };

  useEffect(() => {
    if (editingProperty) {
      fillFormFromProperty(editingProperty);
    } else {
      setTitle("");
      setStatus("For Sale");
      setPrice("");
      setLocationText("");
      setBeds(0);
      setBaths(0);
      setSqft("");
      setExistingImageUrls([]);
      setFilesToUpload([]);
      setAmenitiesText("");
      setHighlightsText("");
      setDeveloper("");
      setPropertyType("");
      setCity("");
      setPossessionDate("");
      setLatitude("");
      setLongitude("");
      setPriceValue("");
      setSlug("");
    }
  }, [editingProperty?.id, editingProperty === null]);

  useEffect(() => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
      );
    }
  }, [title, slug]);

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      await onSave({
        title: title.trim(),
        status,
        price: price.trim(),
        location: locationText.trim(),
        beds: Math.max(0, Number(beds) || 0),
        baths: Math.max(0, Number(baths) || 0),
        sqft: sqft.trim(),
        description: description.trim() || "",
        existingImageUrls,
        filesToUpload,
        amenities: parseCsv(amenitiesText),
        highlights: parseCsv(highlightsText),
        developer: developer.trim(),
        property_type: propertyType.trim(),
        city: city.trim(),
        possession_date: possessionDate.trim() || "",
        latitude: latitude.trim(),
        longitude: longitude.trim(),
        price_value: priceValue.trim(),
        slug: slug.trim(),
      });
    } catch {
      // Error shown via mutationError from parent
    }
  };

  const sectionHeading =
    "text-sm font-semibold uppercase tracking-wide text-muted-foreground";

  return (
    <div className="space-y-6 h-fit">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Property</p>
            {editingId ? (
              <p className="text-xs text-muted-foreground">
                Editing: <span className="font-mono">{editingId}</span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Create new</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
            {onLoadSample && (
              <Button variant="outline" onClick={onLoadSample}>
                Load sample
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Section 1: Basic Information */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Basic Information</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from title"
            />
            <p className="text-xs text-muted-foreground">
              Optional. Editable; auto-generated from title when empty.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Developer</Label>
            <Input
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              placeholder="Developer or builder name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as PropertyStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='e.g. "$1,200,000"'
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Price Value</Label>
            <Input
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              placeholder="Numeric value (e.g. 1200000)"
              inputMode="numeric"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="City, Neighborhood"
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
        </div>
      </Card>

      {/* Section 2: Property Specifications */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Property Specifications</h3>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Beds</Label>
              <Input
                value={beds === 0 ? "" : String(beds)}
                onChange={(e) =>
                  setBeds(e.target.value === "" ? 0 : Number(e.target.value))
                }
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label>Baths</Label>
              <Input
                value={baths === 0 ? "" : String(baths)}
                onChange={(e) =>
                  setBaths(e.target.value === "" ? 0 : Number(e.target.value))
                }
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label>Sqft</Label>
              <Input value={sqft} onChange={(e) => setSqft(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="e.g. Villa, Apartment"
              />
            </div>
            <div className="space-y-2">
              <Label>Possession Date</Label>
              <Input
                type="date"
                value={possessionDate}
                onChange={(e) => setPossessionDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Section 3: Description */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Description</h3>
        <div className="mt-4 space-y-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
      </Card>

      {/* Section 3b: Coordinates */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Coordinates</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 34.0522"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. -118.2437"
              inputMode="decimal"
            />
          </div>
        </div>
      </Card>

      {/* Section 4: Media */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Media</h3>
        <div className="mt-4 space-y-4">
          <Label>Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              setFilesToUpload((prev) => [...prev, ...files]);
              e.target.value = "";
            }}
          />
          {(existingImageUrls.length > 0 || filesToUpload.length > 0) && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {existingImageUrls.map((url, index) => (
                <div
                  key={`existing-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingImageUrls((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <span className="text-xs font-bold">×</span>
                  </button>
                </div>
              ))}
              {filesToUpload.map((file, index) => (
                <ImageFilePreview
                  key={`file-${index}-${file.name}`}
                  file={file}
                  onRemove={() =>
                    setFilesToUpload((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                />
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Upload images to Supabase Storage. They will appear in the gallery after save.
          </p>
        </div>
      </Card>

      {/* Section 5: Features */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Features</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Amenities (comma separated)</Label>
            <Input
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              placeholder="Pool, Gym, Parking"
            />
          </div>
          <div className="space-y-2">
            <Label>Highlights (comma separated)</Label>
            <Input
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              placeholder="Ocean view, Renovated kitchen"
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={isMutating}
          >
            Save
          </Button>
          {onPreview && (
            <Button
              variant="outline"
              onClick={onPreview}
              disabled={previewDisabled}
            >
              Preview
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
