import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Home, Landmark, Coins, Scale, Paintbrush } from "lucide-react";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("affordability");

  const calculatorList = [
    { id: "affordability", name: "Property Affordability", icon: Home },
    { id: "eligibility", name: "Loan Eligibility", icon: Landmark },
    { id: "ownership", name: "Total Cost of Ownership", icon: Coins },
    { id: "rent-vs-buy", name: "Rent vs Buy", icon: Scale },
    { id: "interior", name: "Interior Quote", icon: Paintbrush },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
            Financial Planning
          </h1>
          <p className="text-2xl font-serif italic text-primary">
            Safe Home Budget Calculator
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="affordability" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <TabsList className="bg-secondary/50 h-auto p-1 flex-wrap justify-center">
                {calculatorList.map((calc) => (
                  <TabsTrigger
                    key={calc.id}
                    value={calc.id}
                    className="flex flex-col gap-2 py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm min-w-[120px]"
                  >
                    <calc.icon className="h-5 w-5" />
                    <span className="text-xs font-semibold">{calc.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {calculatorList.map((calc) => (
              <TabsContent key={calc.id} value={calc.id} className="mt-0 outline-none">
                <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <div className="flex items-center gap-3">
                      <calc.icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl">{calc.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="p-8 bg-secondary/20 rounded-2xl border-2 border-dashed border-primary/20">
                        <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">{calc.name} Interface</h3>
                        <p className="text-sm text-muted-foreground">
                          This calculator is being prepared with the latest market rates and financial formulas.
                        </p>
                      </div>
                      <p className="text-sm italic text-muted-foreground">
                        Our experts are fine-tuning the algorithms to ensure your home budget stays "Safe".
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="mt-20 max-w-3xl mx-auto bg-secondary/30 p-8 rounded-3xl border border-border text-center">
          <h2 className="text-xl font-bold mb-3">Need Personalized Advice?</h2>
          <p className="text-muted-foreground mb-6">
            Our financial consultants can help you navigate through complex mortgage structures and tax benefits.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-medium transition-colors">
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
