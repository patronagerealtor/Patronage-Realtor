import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { PropertyForm } from "../components/admin/PropertyForm";
import { PropertyList } from "../components/admin/PropertyList";
import { PropertyDetailDialog } from "../components/shared/PropertyDetailDialog";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { useDataEntryPropertiesOrLocal } from "../hooks/useDataEntryProperties";
import { uploadPropertyImages, fetchContactLeads, deleteMultipleContactLeads, type ContactLeadRow } from "../lib/supabase";
import type { Property } from "../lib/propertyStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Download, Trash2, Users } from "lucide-react";

type UpsertPropertyArg = Omit<Property, "id"> & { id?: string };

export default function DataEntry() {
  const { toast } = useToast();
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
  const [leads, setLeads] = useState<ContactLeadRow[]>([]);
  const [leadsDialogOpen, setLeadsDialogOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  async function fetchLeads() {
    const list = await fetchContactLeads();
    setLeads(list);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = selectedLeads.length > 0 && selectedLeads.length < leads.length;
  }, [selectedLeads.length, leads.length]);

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
    address: string;
    sqft: string;
    description: string;
    existingImageUrls: string[];
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
    google_map_link: string;
    price_value: string;
    slug: string;
    rera_applicable: boolean;
    rera_number: string | null;
  }) => {
    const rawPrice = payload.price?.toString().trim() || "";

    let price_value: number | null = null;
    let price_min: number | null = null;
    let price_max: number | null = null;

    if (rawPrice.includes("-")) {
      const parts = rawPrice.split("-").map((p) => p.trim());
      if (parts.length === 2) {
        const min = Number(parts[0]);
        const max = Number(parts[1]);
        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          price_min = Math.min(min, max);
          price_max = Math.max(min, max);
          price_value = null;
        }
      }
    } else {
      const single = Number(rawPrice);
      if (!Number.isNaN(single)) {
        price_value = single;
        price_min = null;
        price_max = null;
      }
    }

    const isCreating = !effectiveEditId;
    let safeSlug = payload.slug.trim();
    if (isCreating) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      safeSlug = `${safeSlug}-${randomSuffix}`;
    }

    const basePayload = {
      title: payload.title,
      status: payload.status as "Pre-Launch" | "Under Construction" | "Near Possession" | "Ready to Move" | "Resale",
      location: payload.location,
      address: payload.address,
      sqft: payload.sqft,
      description: payload.description || undefined,
      amenities: payload.amenities,
      highlights: payload.highlights,
      developer: payload.developer.trim(),
      property_type: payload.property_type.trim(),
      city: payload.city.trim(),
      bhk_type: payload.bhk_type.trim() || undefined,
      possession_by: payload.possession_by.trim() || undefined,
      latitude: payload.latitude ? Number(payload.latitude) : null,
      longitude: payload.longitude ? Number(payload.longitude) : null,
      google_map_link: payload.google_map_link?.trim() || null,
      price_value,
      price_min,
      price_max,
      slug: safeSlug,
      rera_applicable: payload.rera_applicable,
      rera_number: payload.rera_number,
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
        } as unknown as UpsertPropertyArg);
        const uploaded = await uploadPropertyImages(nextId, payload.filesToUpload);
        imageUrls = [...imageUrls, ...uploaded];
        await upsertProperty({
          id: nextId,
          ...basePayload,
          images: imageUrls,
        } as unknown as UpsertPropertyArg);
      } else {
        nextId = effectiveEditId!;
        const uploaded = await uploadPropertyImages(nextId, payload.filesToUpload);
        imageUrls = [...imageUrls, ...uploaded];
        await upsertProperty({
          id: nextId,
          ...basePayload,
          images: imageUrls,
        } as unknown as UpsertPropertyArg);
      }
    } else {
      nextId = await upsertProperty({
        id: effectiveEditId ?? undefined,
        ...basePayload,
        images: imageUrls,
      } as unknown as UpsertPropertyArg);
    }

    setPreviewId(nextId);
    setLocation(`/data-entry?edit=${encodeURIComponent(nextId)}`, {
      replace: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast({ title: "Saved", description: "Property saved successfully." });
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

  const handleSelectOne = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (leads.length === 0) return;
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((l) => l.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLeads.length === 0) return;
    const ok = window.confirm(
      `Delete ${selectedLeads.length} selected lead(s)? This cannot be undone.`
    );
    if (!ok) return;
    try {
      await deleteMultipleContactLeads(selectedLeads);
      await fetchLeads();
      setSelectedLeads([]);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete leads.");
    }
  };

  const handleExportLeads = () => {
    const headers = ["Property Title", "Name", "Email", "Phone", "Date"];
    const rows = leads.map((lead) => [
      lead.property_title,
      lead.name,
      lead.email,
      lead.phone,
      new Date(lead.created_at).toISOString(),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `property-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-3">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 shrink-0"
              onClick={() => setLeadsDialogOpen(true)}
            >
              <Users className="h-4 w-4" />
              Property Leads
              {leads.length > 0 && (
                <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                  {leads.length}
                </span>
              )}
            </Button>
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

        <Dialog open={leadsDialogOpen} onOpenChange={setLeadsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0">
            <DialogHeader className="p-4 pb-2 pr-12 border-b border-border flex flex-row items-center justify-between gap-4">
              <DialogTitle className="font-heading">Property Leads</DialogTitle>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleDeleteSelected}
                  disabled={selectedLeads.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="gap-2 bg-black text-white hover:bg-black/90"
                  onClick={handleExportLeads}
                  disabled={leads.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4">
              {leads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No leads yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border bg-muted/10 dark:bg-muted/15">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <th className="w-10 p-3">
                          <input
                            ref={selectAllRef}
                            type="checkbox"
                            checked={leads.length > 0 && selectedLeads.length === leads.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 rounded border-border"
                            aria-label="Select all"
                          />
                        </th>
                        <th className="text-left p-3 font-medium">Property Title</th>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Phone</th>
                        <th className="text-left p-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                          <td className="w-10 p-3">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={() => handleSelectOne(lead.id)}
                              className="h-4 w-4 rounded border-border"
                              aria-label={`Select ${lead.name}`}
                            />
                          </td>
                          <td className="p-3">{lead.property_title}</td>
                          <td className="p-3">{lead.name}</td>
                          <td className="p-3">{lead.email}</td>
                          <td className="p-3">{lead.phone}</td>
                          <td className="p-3 text-muted-foreground">
                            {new Date(lead.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />

      <PropertyDetailDialog
        open={!!previewId}
        onOpenChange={(o) => !o && setPreviewId(null)}
        property={selectedForPreview}
        onEdit={handleEditFromDialog}
        onSimilarPropertySelect={(prop) => setPreviewId(String(prop.id))}
      />
    </div>
  );
}
