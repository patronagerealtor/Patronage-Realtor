import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { PropertyDetailDialog } from "../components/shared/PropertyDetailDialog";
import { useDataEntryPropertiesOrLocal } from "../hooks/useDataEntryProperties";
import type { Property, PropertyStatus } from "../lib/propertyStore";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

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

export default function DataEntry() {
  const dataEntry = useDataEntryPropertiesOrLocal();
  const {
    properties,
    byId,
    upsertProperty,
    deleteProperty,
    resetToDefaults,
    dataSource,
    isLoading,
    error,
    mutationError,
  } = dataEntry;
  const isMutating = "isMutating" in dataEntry ? dataEntry.isMutating : false;
  const [location, setLocation] = useLocation();

  const searchParams = useMemo(() => {
    const idx = location.indexOf("?");
    return new URLSearchParams(idx >= 0 ? location.slice(idx + 1) : "");
  }, [location]);

  const editId = searchParams.get("edit");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PropertyStatus>("For Sale");
  const [price, setPrice] = useState("");
  const [locationText, setLocationText] = useState("");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [amenitiesText, setAmenitiesText] = useState("");
  const [highlightsText, setHighlightsText] = useState("");

  const selectedForPreview = previewId ? byId.get(previewId) ?? null : null;

  const fillFormFromProperty = (p: Property) => {
    setEditingId(p.id);
    setTitle(p.title ?? "");
    setStatus(p.status ?? "For Sale");
    setPrice(p.price ?? "");
    setLocationText(p.location ?? "");
    setBeds(Number(p.beds ?? 0));
    setBaths(Number(p.baths ?? 0));
    setSqft(p.sqft ?? "");
    setDescription(p.description ?? "");
    setImagesText((p.images ?? []).join("\n"));
    setAmenitiesText((p.amenities ?? []).join(", "));
    setHighlightsText((p.highlights ?? []).join(", "));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setStatus("For Sale");
    setPrice("");
    setLocationText("");
    setBeds(0);
    setBaths(0);
    setSqft("");
    setDescription("");
    setImagesText("");
    setAmenitiesText("");
    setHighlightsText("");

    // remove edit param from URL (if present)
    setLocation("/data-entry", { replace: true });
  };

  useEffect(() => {
    if (!editId) return;
    const p = byId.get(editId);
    if (!p) return;
    fillFormFromProperty(p);
  }, [editId, byId]);

  const onSave = async () => {
    if (!title.trim()) return;
    try {
      const nextId = await upsertProperty({
        id: editingId ?? undefined,
        title: title.trim(),
        status,
        price: price.trim(),
        location: locationText.trim(),
        beds: Math.max(0, Number(beds) || 0),
        baths: Math.max(0, Number(baths) || 0),
        sqft: sqft.trim(),
        description: description.trim() || undefined,
        images: parseLines(imagesText),
        amenities: parseCsv(amenitiesText),
        highlights: parseCsv(highlightsText),
      });
      setPreviewId(nextId);
      setLocation(`/data-entry?edit=${encodeURIComponent(nextId)}`, {
        replace: true,
      });
    } catch {
      // Error is shown via saveError / mutationError from hook
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            Admin: Data Entry
          </h1>
          <p className="text-muted-foreground mt-2">
            Add or edit properties used by the Property Details popup. Data is
            stored in Supabase when configured, otherwise in your browser
            (localStorage).
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span
              className={
                dataSource === "supabase"
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              }
            >
              {dataSource === "supabase"
                ? "Connected to Supabase (property_listings)"
                : "Using localStorage (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in root .env for Supabase)"}
            </span>
            {isLoading && (
              <span className="text-muted-foreground">Loading…</span>
            )}
            {isMutating && (
              <span className="text-muted-foreground">Saving…</span>
            )}
            {error && (
              <span className="text-destructive">
                Load error: {error instanceof Error ? error.message : String(error)}
              </span>
            )}
            {mutationError != null && (
              <span className="text-destructive">
                Save error: {mutationError instanceof Error ? mutationError.message : String(mutationError)}
              </span>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">
          {/* FORM */}
          <Card className="lg:col-span-5 p-6 space-y-5 h-fit">
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
                <Button variant="outline" onClick={resetToDefaults}>
                  Load sample
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
              <Label>Location</Label>
              <Input
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="City, Neighborhood"
              />
            </div>

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

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Images (one URL per line)</Label>
              <Textarea
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                rows={3}
                placeholder="https://…"
              />
            </div>

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

            <div className="pt-2 flex gap-2">
              <Button className="flex-1" onClick={onSave}>
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const id = editingId ?? previewId;
                  if (id) setPreviewId(id);
                }}
                disabled={!previewId && !editingId}
              >
                Preview
              </Button>
            </div>
          </Card>

          {/* LIST */}
          <Card className="lg:col-span-7 p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Properties</h2>
              <Badge variant="secondary">{properties.length}</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{p.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            fillFormFromProperty(p);
                            setLocation(
                              `/data-entry?edit=${encodeURIComponent(p.id)}`,
                              { replace: true },
                            );
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewId(p.id)}
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            deleteProperty(p.id);
                            if (editingId === p.id) resetForm();
                            if (previewId === p.id) setPreviewId(null);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      <Footer />

      <PropertyDetailDialog
        open={!!previewId}
        onOpenChange={(o) => !o && setPreviewId(null)}
        property={selectedForPreview}
        onEdit={(id: string) => {
          const p = byId.get(id);
          if (p) fillFormFromProperty(p);
          setPreviewId(null);
          setLocation(`/data-entry?edit=${encodeURIComponent(id)}`);
        }}
      />
    </div>
  );
}

