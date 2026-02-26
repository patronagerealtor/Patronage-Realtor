import { useState } from "react";
import { calculatePrice } from "../../lib/interiors/priceCalculator";
import { BHK, PackageTier, AREA_BANDS } from "../../lib/interiors/pricingConfig";
import { Card, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calculator } from "lucide-react";

export function InteriorPriceCalculator() {
  const [bhk, setBhk] = useState<BHK>("2bhk");
  const [pkg, setPkg] = useState<PackageTier>("gold");
  const [renovation, setRenovation] = useState(false);
  const [customization, setCustomization] =
    useState<"low" | "medium" | "high">("medium");
  const [area, setArea] = useState<number | undefined>(undefined);

  const price = calculatePrice({
    bhk,
    packageTier: pkg,
    carpetArea: area,
    renovation,
    customization
  });

  const band = AREA_BANDS[bhk];

  return (
    <section id="calculate-interior" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">
            Estimate
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
            Calculate your Interior
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get an estimated cost range based on your BHK, package, and preferences.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left: Inputs */}
            <Card className="lg:col-span-5 p-6 h-fit border-t-4 border-t-primary border-border shadow-lg">
              <div className="flex items-center gap-2 mb-5">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Inputs</CardTitle>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calc-bhk">BHK</Label>
                  <Select value={bhk} onValueChange={(v: string) => setBhk(v as BHK)}>
                    <SelectTrigger id="calc-bhk" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1bhk">1 BHK</SelectItem>
                      <SelectItem value="2bhk">2 BHK</SelectItem>
                      <SelectItem value="3bhk">3 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-pkg">Package</Label>
                  <Select value={pkg} onValueChange={(v: string) => setPkg(v as PackageTier)}>
                    <SelectTrigger id="calc-pkg" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="ultra">Ultra-Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="calc-area">Approx Carpet Area (sq ft)</Label>
                  <Input
                    id="calc-area"
                    type="number"
                    placeholder={`${band.min} – ${band.max}`}
                    className="w-full"
                    value={area ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArea(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="calc-renovation"
                    type="checkbox"
                    checked={renovation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenovation(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="calc-renovation" className="cursor-pointer font-normal">
                    Renovation (existing flat)
                  </Label>
                </div>
                {pkg !== "ultra" ? (
                  <div className="space-y-2">
                    <Label htmlFor="calc-custom">Customization</Label>
                    <Select
                      value={customization}
                      onValueChange={(v: string) =>
                        setCustomization(v as "low" | "medium" | "high")
                      }
                    >
                      <SelectTrigger id="calc-custom" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </Card>

            {/* Right: Output */}
            <div className="lg:col-span-7 flex flex-col">
              <Card className="p-6 flex flex-col justify-center min-h-full border-border shadow-lg bg-muted/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Estimated cost range
                </h3>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  {price.max ? (
                    <>₹{price.min}L – ₹{price.max}L</>
                  ) : (
                    <>From ₹{price.min}L+</>
                  )}*
                </p>
                <p className="text-sm text-muted-foreground font-bold" >
                  Final pricing depends on layout, material selection and site conditions.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}