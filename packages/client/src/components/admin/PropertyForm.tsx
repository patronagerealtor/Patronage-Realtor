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
import { supabase } from "../../lib/supabase";
import { AmenityIcon } from "../shared/AmenityIcon";

const STATUS_OPTIONS: PropertyStatus[] = [
  "Pre-Launch",
  "Under Construction",
  "Near Possession",
  "Ready to Move",
  "Resale",
];

const BHK_OPTIONS = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5 BHK",
  "1 to 3 BHK",
  "1 to 4 BHK",
  "2 to 3 BHK",
  "2 to 4 BHK",
  "2 to 5 BHK",
];

const PROPERTY_TYPE_OPTIONS = [
  "Apartment",
  "Villa",
  "Commercial space",
  "Office space",
  "Hotel space",
  "Hospital space",
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
  address: string;
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
  bhk_type: string;
  possession_by: string;
  latitude: string;
  longitude: string;
  price_value: string;
  slug: string;
  rera_applicable: boolean;
  rera_number: string | null;
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
  const [status, setStatus] = useState<PropertyStatus>("Under Construction");
  const [price, setPrice] = useState("");
  const [locationText, setLocationText] = useState("");
  const [address, setAddress] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [possessionBy, setPossessionBy] = useState("");
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [developer, setDeveloper] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [slug, setSlug] = useState("");
  const [reraApplicable, setReraApplicable] = useState(false);
  const [reraNumber, setReraNumber] = useState("");

  const fillFormFromProperty = (p: Property) => {
    setTitle(p.title ?? "");
    setStatus(p.status ?? "Under Construction");
    setPrice(p.price ?? "");
    setLocationText(p.location ?? "");
    setAddress(p.address ?? "");
    setBhkType(p.bhk_type ?? "");
    setPossessionBy(p.possession_by ?? "");
    setSqft(p.sqft ?? "");
    setDescription(p.description ?? "");
    setExistingImageUrls(p.images ?? []);
    setFilesToUpload([]);
    setSelectedAmenities((p.amenities ?? []).map((a) => String(a.id).toLowerCase()));
    setDeveloper(p.developer ?? "");
    setPropertyType(p.property_type ?? "");
    setLatitude(p.latitude != null ? String(p.latitude) : "");
    setLongitude(p.longitude != null ? String(p.longitude) : "");
    setSlug(p.slug ?? "");
    setReraApplicable(p.rera_applicable ?? false);
    setReraNumber(p.rera_number ?? "");
  };

  const resetForm = () => {
    setTitle("");
    setStatus("Under Construction");
    setPrice("");
    setLocationText("");
    setAddress("");
    setBhkType("");
    setPossessionBy("");
    setSqft("");
    setDescription("");
    setExistingImageUrls([]);
    setFilesToUpload([]);
    setSelectedAmenities([]);
    setDeveloper("");
    setPropertyType("");
    setLatitude("");
    setLongitude("");
    setSlug("");
    setReraApplicable(false);
    setReraNumber("");
    onReset();
  };

  useEffect(() => {
    if (editingProperty) {
      fillFormFromProperty(editingProperty);
    } else {
      setTitle("");
      setStatus("Under Construction");
      setPrice("");
      setLocationText("");
      setAddress("");
      setBhkType("");
      setPossessionBy("");
      setSqft("");
      setExistingImageUrls([]);
      setFilesToUpload([]);
      setSelectedAmenities([]);
      setDeveloper("");
      setPropertyType("");
      setLatitude("");
      setLongitude("");
      setSlug("");
      setReraApplicable(false);
      setReraNumber("");
    }
  }, [editingProperty]);

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

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("amenities")
      .select("*")
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setAmenitiesList(
            data.map((r: { id: string; name: string; icon: string }) => ({
              id: String(r.id).toLowerCase(),
              name: r.name ?? "",
              icon: r.icon ?? "",
            }))
          );
        }
      });
  }, []);

  const toggleAmenity = (id: string) => {
    const normalizedId = String(id).toLowerCase();
    setSelectedAmenities((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((a) => a !== normalizedId)
        : [...prev, normalizedId]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      await onSave({
        title: title.trim(),
        status,
        price: price.trim(),
        location: locationText.trim(),
        address: address.trim(),
        sqft: sqft.trim(),
        description: description.trim() || "",
        existingImageUrls,
        filesToUpload,
        amenities: selectedAmenities,
        highlights: [],
        developer: developer.trim(),
        property_type: propertyType.trim(),
        city: "",
        bhk_type: bhkType.trim(),
        possession_by: possessionBy.trim(),
        latitude: latitude.trim(),
        longitude: longitude.trim(),
        price_value: "",
        slug: slug.trim(),
        rera_applicable: reraApplicable,
        rera_number: reraApplicable ? reraNumber.trim() || null : null,
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
                onChange={(e) => setPrice(e.target.value.replace(/[a-zA-Z]/g, ""))}
                placeholder='e.g. "$1,200,000"'
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              type="text"
              list="location-options"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Select location"
            />
            <datalist id="location-options">
              <option value="Ravet" />
              <option value="Kiwle" />
              <option value="Gahunje" />
              <option value="Mamurdi" />
              <option value="Nigdi" />
              <option value="Akurdi" />
              <option value="Pimpri" />
              <option value="Chinchwad" />
              <option value="Punawale" />
              <option value="Tathwade" />
              <option value="Hijewadi Phase 1" />
              <option value="Hijewadi Phase 2" />
              <option value="Hijewadi Phase 3" />
              <option value="Wakad" />
              <option value="Balewadi" />
              <option value="Baner" />
              <option value="Pimple Nilakh" />
              <option value="Pimple Saudagar" />
              <option value="Bavdhan" />
              <option value="Aundh" />

            </datalist>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complete address"
            />
          </div>
          <div className="space-y-2">
            <Label>RERA</Label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={reraApplicable}
                onChange={(e) => {
                  setReraApplicable(e.target.checked);
                  if (!e.target.checked) setReraNumber("");
                }}
                className="h-4 w-4 rounded border-input"
              />
              <span>RERA applicable</span>
            </label>
            <Input
              type="text"
              disabled={!reraApplicable}
              value={reraNumber}
              onChange={(e) => setReraNumber(e.target.value)}
              placeholder="RERA number"
            />
          </div>
        </div>
      </Card>

      {/* Section 2: Property Specifications */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Property Specifications</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>BHK Type</Label>
            <Input
              type="text"
              list="bhk-options"
              value={bhkType}
              onChange={(e) => setBhkType(e.target.value)}
              placeholder="Select or type BHK range"
            />
            <datalist id="bhk-options">
              {BHK_OPTIONS.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label>Possession By</Label>
            <Input
              type="month"
              value={possessionBy}
              onChange={(e) => setPossessionBy(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sqft</Label>
            <Input value={sqft} onChange={(e) => setSqft(e.target.value.replace(/[a-zA-Z]/g, ""))} />
          </div>
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Input
              type="text"
              list="property-type-options"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              placeholder="Select or type property type"
            />
            <datalist id="property-type-options">
              {PROPERTY_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
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
              onChange={(e) => setLatitude(e.target.value.replace(/[a-zA-Z]/g, ""))}
              placeholder="e.g. 34.0522"
              inputMode="decimal"
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              value={longitude}
              onChange={(e) => setLongitude(e.target.value.replace(/[a-zA-Z]/g, ""))}
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
            disabled={existingImageUrls.length + filesToUpload.length >= 4}
            className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              setFilesToUpload((prev) => {
                const total = existingImageUrls.length + prev.length;
                const remaining = Math.max(0, 4 - total);
                const toAdd = files.slice(0, remaining);
                return [...prev, ...toAdd];
              });
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
            Upload images to Supabase Storage (max 4 per property). They will appear in the gallery after save.
          </p>
        </div>
      </Card>

      {/* Section 5: Features */}
      <Card className="p-6">
        <h3 className={sectionHeading}>Features</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {amenitiesList.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No amenities in database. Add rows to the <code className="rounded bg-muted px-1">amenities</code> table in Supabase.
                </p>
              )}
              {amenitiesList.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity.id);
                return (
                  <label
                    key={amenity.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAmenity(amenity.id)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <AmenityIcon name={amenity.icon} />
                    <span>{amenity.name}</span>
                  </label>
                );
              })}
            </div>
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
