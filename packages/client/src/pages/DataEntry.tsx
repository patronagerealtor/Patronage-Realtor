import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { PropertyForm } from "../components/admin/PropertyForm";
import { PropertyList } from "../components/admin/PropertyList";
import { PropertyDetailDialog } from "../components/shared/PropertyDetailDialog";
import { useDataEntryPropertiesOrLocal } from "../hooks/useDataEntryProperties";
import { uploadPropertyImages } from "../lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

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

  const effectiveEditId = editId ?? editingId;
  const editingProperty = effectiveEditId ? (byId.get(effectiveEditId) ?? null) : null;
  const selectedForPreview = previewId ? byId.get(previewId) ?? null : null;

  useEffect(() => {
    if (!editId) return;
    const p = byId.get(editId);
    if (!p) return;
    setEditingId(editId);
  }, [editId, byId]);

  const handleSave = async (payload: {
    title: string;
    status: string;
    price: string;
    location: string;
    beds: number;
    baths: number;
    sqft: string;
    description: string;
    existingImageUrls: string[];
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
  }) => {
    const basePayload = {
      title: payload.title,
      status: payload.status as "For Sale" | "For Rent" | "Coming Soon" | "Sold",
      price: payload.price,
      location: payload.location,
      beds: payload.beds,
      baths: payload.baths,
      sqft: payload.sqft,
      description: payload.description || undefined,
      amenities: payload.amenities,
      highlights: payload.highlights,
      developer: payload.developer.trim(),
      property_type: payload.property_type.trim(),
      city: payload.city.trim(),
      possession_date: payload.possession_date || null,
      latitude: payload.latitude ? Number(payload.latitude) : null,
      longitude: payload.longitude ? Number(payload.longitude) : null,
      price_value: payload.price_value ? Number(payload.price_value) : null,
      slug: payload.slug.trim(),
    };

    let nextId: string;
    let imageUrls = payload.existingImageUrls ?? [];

    if (payload.filesToUpload?.length > 0) {
      const isNew = !effectiveEditId;
      if (isNew) {
        nextId = await upsertProperty({
          id: undefined,
          ...basePayload,
          images: [],
        });
        const uploaded = await uploadPropertyImages(nextId, payload.filesToUpload);
        imageUrls = [...imageUrls, ...uploaded];
        await upsertProperty({
          id: nextId,
          ...basePayload,
          images: imageUrls,
        });
      } else {
        nextId = effectiveEditId!;
        const uploaded = await uploadPropertyImages(nextId, payload.filesToUpload);
        imageUrls = [...imageUrls, ...uploaded];
        await upsertProperty({
          id: nextId,
          ...basePayload,
          images: imageUrls,
        });
      }
    } else {
      nextId = await upsertProperty({
        id: effectiveEditId ?? undefined,
        ...basePayload,
        images: imageUrls,
      });
    }

    setPreviewId(nextId);
    setLocation(`/data-entry?edit=${encodeURIComponent(nextId)}`, {
      replace: true,
    });
    return nextId;
  };

  const handleReset = () => {
    setEditingId(null);
    setLocation("/data-entry", { replace: true });
  };

  const handleEdit = (id: string) => {
    const p = byId.get(id);
    if (!p) return;
    setEditingId(id);
    setLocation(`/data-entry?edit=${encodeURIComponent(id)}`, { replace: true });
  };

  const handleDelete = (id: string) => {
    deleteProperty(id);
    if (editingId === id) {
      setEditingId(null);
      setLocation("/data-entry", { replace: true });
    }
    if (previewId === id) setPreviewId(null);
  };

  const handlePreviewFromList = (id: string) => {
    setPreviewId(id);
  };

  const handlePreviewFromForm = () => {
    const id = editingId ?? previewId;
    if (id) setPreviewId(id);
  };

  const handleEditFromDialog = (id: string) => {
    const p = byId.get(id);
    if (p) setEditingId(id);
    setPreviewId(null);
    setLocation(`/data-entry?edit=${encodeURIComponent(id)}`);
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
                ? "Connected to Supabase (properties)"
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
          <div className="lg:col-span-5 rounded-lg bg-muted/10 dark:bg-muted/15 p-4">
            <PropertyForm
            editingProperty={editingProperty}
            editingId={effectiveEditId}
            onSave={handleSave}
            onReset={handleReset}
            isMutating={isMutating}
            onLoadSample={resetToDefaults}
            onPreview={handlePreviewFromForm}
            previewDisabled={!previewId && !editingId}
          />
          </div>

          <div className="lg:col-span-7 rounded-lg bg-muted/5 dark:bg-muted/10">
          <PropertyList
            properties={properties}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreviewFromList}
          />
          </div>
        </div>
      </main>

      <Footer />

      <PropertyDetailDialog
        open={!!previewId}
        onOpenChange={(o) => !o && setPreviewId(null)}
        property={selectedForPreview}
        onEdit={handleEditFromDialog}
      />
    </div>
  );
}
