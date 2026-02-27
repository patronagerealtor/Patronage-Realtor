import { useReducer, useState } from "react";
import { calculatePrice } from "../../lib/interiors/priceCalculator";
import { BHK, PackageTier, AREA_BANDS } from "../../lib/interiors/pricingConfig";
import { Card, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calculator } from "lucide-react";

type CustomizationLevel = "low" | "medium" | "high";

type CalculatorState = {
  bhk: BHK;
  pkg: PackageTier;
  renovation: boolean;
  customization: CustomizationLevel;
  area: number | undefined;
};

type CalculatorAction =
  | { type: "SET_BHK"; payload: BHK }
  | { type: "SET_PKG"; payload: PackageTier }
  | { type: "SET_RENOVATION"; payload: boolean }
  | { type: "SET_CUSTOMIZATION"; payload: CustomizationLevel }
  | { type: "SET_AREA"; payload: number | undefined };

const initialState: CalculatorState = {
  bhk: "2bhk",
  pkg: "signature",
  renovation: false,
  customization: "medium",
  area: undefined,
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case "SET_BHK":
      return { ...state, bhk: action.payload };
    case "SET_PKG":
      return { ...state, pkg: action.payload };
    case "SET_RENOVATION":
      return { ...state, renovation: action.payload };
    case "SET_CUSTOMIZATION":
      return { ...state, customization: action.payload };
    case "SET_AREA":
      return { ...state, area: action.payload };
    default:
      return state;
  }
}

export function InteriorPriceCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const { bhk, pkg, renovation, customization, area } = state;

  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({ name: "", email: "", whatsapp: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const price = calculatePrice({
    bhk,
    packageTier: pkg,
    carpetArea: area,
    renovation,
    customization,
  });

  const band = AREA_BANDS[bhk];

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const name = formValues.name.trim();
    const email = formValues.email.trim();
    const whatsapp = formValues.whatsapp.trim();
    if (!name || !email || !whatsapp) {
      setFormError("Name, WhatsApp No. and Email are required.");
      return;
    }
    setSubmittedName(name);
    setDetailsSubmitted(true);
  };

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
                  <Select value={bhk} onValueChange={(v: string) => dispatch({ type: "SET_BHK", payload: v as BHK })}>
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
                  <Select value={pkg} onValueChange={(v: string) => dispatch({ type: "SET_PKG", payload: v as PackageTier })}>
                    <SelectTrigger id="calc-pkg" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essence">Essence</SelectItem>
                      <SelectItem value="signature">Signature</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                      <SelectItem value="bespoke">Bespoke</SelectItem>
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
                      dispatch({ type: "SET_AREA", payload: e.target.value ? Number(e.target.value) : undefined })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="calc-renovation"
                    type="checkbox"
                    checked={renovation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "SET_RENOVATION", payload: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="calc-renovation" className="cursor-pointer font-normal">
                    Renovation (existing flat)
                  </Label>
                </div>
                {pkg !== "bespoke" ? (
                  <div className="space-y-2">
                    <Label htmlFor="calc-custom">Customization</Label>
                    <Select
                      value={customization}
                      onValueChange={(v: string) =>
                        dispatch({ type: "SET_CUSTOMIZATION", payload: v as CustomizationLevel })
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

            {/* Right: Output or contact form */}
            <div className="lg:col-span-7 flex flex-col">
              <Card className="p-6 flex flex-col justify-center min-h-full border-border shadow-lg bg-muted/20">
                {detailsSubmitted && submittedName ? (
                  <>
                    <p className="text-lg font-medium text-primary mb-4">
                      We'll Get Back to You {submittedName}
                    </p>
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
                    <p className="text-sm text-muted-foreground font-bold">
                      Final pricing depends on layout, material selection and site conditions.
                    </p>
                  </>
                ) : (
                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Enter your details to see estimate
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="ipc-name">Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="ipc-name"
                        value={formValues.name}
                        onChange={(e) => setFormValues((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ipc-whatsapp">WhatsApp No. <span className="text-destructive">*</span></Label>
                      <Input
                        id="ipc-whatsapp"
                        type="tel"
                        value={formValues.whatsapp}
                        onChange={(e) => setFormValues((p) => ({ ...p, whatsapp: e.target.value }))}
                        placeholder="e.g. 9876543210"
                        required
                        autoComplete="tel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ipc-email">Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="ipc-email"
                        type="email"
                        value={formValues.email}
                        onChange={(e) => setFormValues((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                    {formError && (
                      <p className="text-sm text-destructive">{formError}</p>
                    )}
                    <Button type="submit" className="w-full">
                      See my estimate
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}