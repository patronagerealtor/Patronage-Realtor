import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const packages = [
  { name: "Silver", color: "bg-slate-100" },
  { name: "Gold", color: "bg-yellow-50" },
  { name: "Platinum", color: "bg-blue-50" },
  { name: "Luxury", color: "bg-purple-50" },
];

export default function InteriorPackageDetails() {
  const { package: pkgName } = useParams();
  const [, setLocation] = useLocation();
  const [houseType, setHouseType] = useState("2BHK");
  const [totalArea, setTotalArea] = useState("");

  const pkg = packages.find((p) => p.name.toLowerCase() === pkgName?.toLowerCase());
  const bgColor = pkg ? pkg.color : "bg-background";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col`}>
      <Header />
      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/interiors")}
            className="mb-8"
          >
            ← Back to Packages
          </Button>

          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Customize Your {pkg?.name} Package</CardTitle>
              <CardDescription>
                Provide your home details to get a personalized quote.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">House Type</Label>
                <RadioGroup 
                  value={houseType} 
                  onValueChange={setHouseType}
                  className="grid grid-cols-3 gap-4"
                >
                  {["1BHK", "2BHK", "3BHK"].map((type) => (
                    <div key={type} className="flex items-center space-x-2 border p-4 rounded-xl hover:bg-white/50 transition-colors cursor-pointer">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="cursor-pointer font-medium">{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label htmlFor="area" className="text-lg font-semibold">Total Area (sq.ft.)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="e.g. 1200"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  className="text-lg py-6 rounded-xl"
                />
              </div>

              <Button className="w-full text-lg py-6 rounded-xl mt-4">
                Get Estimated Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
