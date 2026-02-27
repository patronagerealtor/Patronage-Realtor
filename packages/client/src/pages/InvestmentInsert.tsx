import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Upload, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { useInvestmentProperties } from "../hooks/useInvestmentProperties";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import type { CommercialItem, LandItem } from "../lib/investmentStorage";

const BADGE_OPTIONS = ["Hot", "New", "Prime", "Leased"] as const;
const COMMERCIAL_TYPES = ["Grade A Office", "Retail Complex", "Industrial / Warehouse", "Mixed-Use", "Office Spaces", "Shop", "Show Room"];
const LAND_ZONING = ["Mixed-Use", "Industrial", "Commercial", "Residential", "Agricultural"];

const IMAGE_COMPRESS_OPTIONS = { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: false };

async function fileToDataUrl(file: File): Promise<string> {
  const compressed = await imageCompression(file, IMAGE_COMPRESS_OPTIONS);
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Failed to read image"));
    r.readAsDataURL(compressed);
  });
}

function ImageField({
  id,
  value,
  onChange,
  onError,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isDataUrl = value.startsWith("data:");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } catch {
      onError?.("Image processing failed. Try a smaller image.");
    } finally {
      setUploading(false);
      e.target.value = "";
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Image (URL or upload)</Label>
      <Input
        id={id}
        value={isDataUrl ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isDataUrl ? "Image set from file" : "https://... or upload below"}
        disabled={disabled}
        className="mb-2"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={disabled || uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? "Processing…" : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload image
            </>
          )}
        </Button>
        {value && (
          <>
            <div className="w-16 h-16 rounded border border-border overflow-hidden bg-muted shrink-0">
              <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} aria-label="Clear image">
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/** Content-only component for use inside Data Entry (Commercial mode). */
export function InvestmentInsertContent() {
  const { commercial, land, addCommercial, addLand, removeCommercial, removeLand } = useInvestmentProperties();
  const [activeTab, setActiveTab] = useState<"commercial" | "land">("commercial");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [commercialForm, setCommercialForm] = useState<Omit<CommercialItem, "id">>({
    title: "",
    location: "",
    type: "Grade A Office",
    size: "",
    roi: "",
    status: "Available",
    price: "",
    img: "",
    badge: "New",
  });

  const [landForm, setLandForm] = useState<Omit<LandItem, "id">>({
    title: "",
    location: "",
    acres: "",
    zoning: "Mixed-Use",
    potential: "",
    price: "",
    img: "",
    badge: "Prime",
  });

  const handleCommercialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercialForm.title.trim()) {
      setMessage({ type: "error", text: "Title is required." });
      return;
    }
    addCommercial(commercialForm);
    setCommercialForm({
      title: "",
      location: "",
      type: "Grade A Office",
      size: "",
      roi: "",
      status: "Available",
      price: "",
      img: "",
      badge: "New",
    });
    setMessage({ type: "success", text: "Commercial property added." });
  };

  const handleLandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landForm.title.trim()) {
      setMessage({ type: "error", text: "Title is required." });
      return;
    }
    addLand(landForm);
    setLandForm({
      title: "",
      location: "",
      acres: "",
      zoning: "Mixed-Use",
      potential: "",
      price: "",
      img: "",
      badge: "Prime",
    });
    setMessage({ type: "success", text: "Land listing added." });
  };

  return (
    <>
      {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === "success" ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400" : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {message.text}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "commercial" | "land")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
            <TabsTrigger value="land">Land</TabsTrigger>
          </TabsList>

          <TabsContent value="commercial">
            <Card>
              <CardHeader>
                <CardTitle>Add commercial property</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommercialSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-title">Title *</Label>
                      <Input id="c-title" value={commercialForm.title} onChange={(e) => setCommercialForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Metro Business Tower" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-location">Location</Label>
                      <Input id="c-location" value={commercialForm.location} onChange={(e) => setCommercialForm((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Downtown Chicago, IL" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-type">Type</Label>
                      <select
                        id="c-type"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={commercialForm.type}
                        onChange={(e) => setCommercialForm((p) => ({ ...p, type: e.target.value }))}
                      >
                        {COMMERCIAL_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-size">Size</Label>
                      <Input id="c-size" value={commercialForm.size} onChange={(e) => setCommercialForm((p) => ({ ...p, size: e.target.value }))} placeholder="e.g. 85,000 sq ft" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-roi">ROI</Label>
                      <Input id="c-roi" value={commercialForm.roi} onChange={(e) => setCommercialForm((p) => ({ ...p, roi: e.target.value }))} placeholder="e.g. 14.2%" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-status">Status</Label>
                      <Input id="c-status" value={commercialForm.status} onChange={(e) => setCommercialForm((p) => ({ ...p, status: e.target.value }))} placeholder="Available / Leased" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-price">Price</Label>
                      <Input id="c-price" value={commercialForm.price} onChange={(e) => setCommercialForm((p) => ({ ...p, price: e.target.value }))} placeholder="e.g. ₹42 Cr" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-badge">Badge</Label>
                      <select
                        id="c-badge"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={commercialForm.badge}
                        onChange={(e) => setCommercialForm((p) => ({ ...p, badge: e.target.value }))}
                      >
                        {BADGE_OPTIONS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <ImageField
                    id="c-img"
                    value={commercialForm.img}
                    onChange={(url) => setCommercialForm((p) => ({ ...p, img: url }))}
                    onError={(text) => setMessage({ type: "error", text })}
                  />
                  <Button type="submit">Add commercial property</Button>
                </form>
              </CardContent>
            </Card>
            {commercial.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-base">Saved commercial ({commercial.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {commercial.map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                        <span className="font-medium truncate">{c.title}</span>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeCommercial(c.id)}>Remove</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="land">
            <Card>
              <CardHeader>
                <CardTitle>Add land listing</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLandSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="l-title">Title *</Label>
                      <Input id="l-title" value={landForm.title} onChange={(e) => setLandForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Sunset Valley Parcel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="l-location">Location</Label>
                      <Input id="l-location" value={landForm.location} onChange={(e) => setLandForm((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Phoenix, AZ" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="l-acres">Acres</Label>
                      <Input id="l-acres" value={landForm.acres} onChange={(e) => setLandForm((p) => ({ ...p, acres: e.target.value }))} placeholder="e.g. 48 Acres" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="l-zoning">Zoning</Label>
                      <select
                        id="l-zoning"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={landForm.zoning}
                        onChange={(e) => setLandForm((p) => ({ ...p, zoning: e.target.value }))}
                      >
                        {LAND_ZONING.map((z) => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="l-potential">Potential</Label>
                      <Input id="l-potential" value={landForm.potential} onChange={(e) => setLandForm((p) => ({ ...p, potential: e.target.value }))} placeholder="e.g. Residential + Retail" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="l-price">Price</Label>
                      <Input id="l-price" value={landForm.price} onChange={(e) => setLandForm((p) => ({ ...p, price: e.target.value }))} placeholder="e.g. ₹8.4 Cr" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="l-badge">Badge</Label>
                      <select
                        id="l-badge"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={landForm.badge}
                        onChange={(e) => setLandForm((p) => ({ ...p, badge: e.target.value }))}
                      >
                        {BADGE_OPTIONS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <ImageField
                        id="l-img"
                        value={landForm.img}
                        onChange={(url) => setLandForm((p) => ({ ...p, img: url }))}
                        onError={(text) => setMessage({ type: "error", text })}
                      />
                    </div>
                  </div>
                  <Button type="submit">Add land listing</Button>
                </form>
              </CardContent>
            </Card>
            {land.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-base">Saved land listings ({land.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {land.map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                        <span className="font-medium truncate">{l.title}</span>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeLand(l.id)}>Remove</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
    </>
  );
}

export default function InvestmentInsert() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/data-entry?mode=commercial">
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Back to Data Entry">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Investment data entry</h1>
            <p className="text-sm text-muted-foreground">Add commercial or land listings for the Investment page.</p>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        <InvestmentInsertContent />
      </main>
    </div>
  );
}
