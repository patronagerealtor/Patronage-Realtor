import { useReducer } from "react";
import { Link } from "wouter";
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
import { Calculator, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

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
  const { user } = useAuth();
  const showQuote = !!user;

  const price = calculatePrice({
    bhk,
    packageTier: pkg,
    carpetArea: area,
    renovation,
    customization,
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

            {/* Right: Output (or Sign up layer) */}
            <div className="lg:col-span-7 flex flex-col relative">
              <Card className="p-6 flex flex-col justify-center min-h-full border-border shadow-lg bg-muted/20">
                {showQuote ? (
                  <>
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
                  <div className="flex flex-col items-center justify-center text-center py-4 px-2">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <Lock className="h-8 w-8 text-primary" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Sign up to see your Quote and Floor Plan</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                      Create an account to view your estimated cost range and access floor plan options.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link href="/login">
                        <Button variant="default">Sign up</Button>
                      </Link>
                      <Link href="/login">
                        <Button variant="outline">Sign in</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}