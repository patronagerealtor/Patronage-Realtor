import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, Landmark, Coins, Scale, Paintbrush } from "lucide-react";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("affordability");

  // 1. Property Affordability
  const [affIncome, setAffIncome] = useState(100000);
  const [affEmi, setAffEmi] = useState(0);
  const [affDownPayment, setAffDownPayment] = useState(500000);
  const [affTenure, setAffTenure] = useState("20");
  const [affResults, setAffResults] = useState({
    maxEmi: 0,
    loanAmount: 0,
    propertyPrice: 0,
  });

  // 2. Loan Eligibility
  const [eligIncome, setEligIncome] = useState(100000);
  const [eligEmi, setEligEmi] = useState(0);
  const [eligTenure, setEligTenure] = useState("20");
  const [eligResults, setEligResults] = useState({
    loanAmount: 0,
    monthlyEmi: 0,
  });

  // 3. Total Cost of Ownership
  const [costPrice, setCostPrice] = useState(5000000);
  const [costParking, setCostParking] = useState("no");
  const [costResults, setCostResults] = useState({
    stampDuty: 0,
    gst: 0,
    parking: 0,
    total: 0,
  });

  // 4. Rent vs Buy
  const [rvbRent, setRvbRent] = useState(20000);
  const [rvbPrice, setRvbPrice] = useState(5000000);
  const [rvbEmi, setRvbEmi] = useState(35000);
  const [rvbHorizon, setRvbHorizon] = useState(10);
  const [rvbResults, setRvbResults] = useState({
    totalRent: 0,
    totalEmi: 0,
    futureValue: 0,
    result: "",
    breakEven: -1,
  });

  const calculateAffordability = () => {
    const disposable = affIncome - affEmi;
    const maxEmi = disposable * 0.7;
    const rate = 0.08 / 12;
    const months = parseInt(affTenure) * 12;
    const loanAmount =
      maxEmi *
      ((Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months)));
    setAffResults({
      maxEmi: Math.round(maxEmi),
      loanAmount: Math.round(loanAmount),
      propertyPrice: Math.round(loanAmount + affDownPayment),
    });
  };

  const calculateEligibility = () => {
    const disposable = eligIncome - eligEmi;
    const maxEmi = disposable * 0.7;
    const rate = 0.08 / 12;
    const months = parseInt(eligTenure) * 12;
    const loanAmount =
      maxEmi *
      ((Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months)));
    setEligResults({
      loanAmount: Math.round(loanAmount),
      monthlyEmi: Math.round(maxEmi),
    });
  };

  const calculateOwnership = () => {
    const stampDuty = costPrice * 0.07;
    const gst = costPrice * 0.05;
    const parking = costParking === "yes" ? 300000 : 0;
    setCostResults({
      stampDuty: Math.round(stampDuty),
      gst: Math.round(gst),
      parking,
      total: Math.round(costPrice + stampDuty + gst + parking),
    });
  };

  const calculateRentVsBuy = () => {
    let totalRentOutflow = 0;
    let totalBuyingOutflow = 0;
    let currentRent = rvbRent;
    let breakEvenYear = -1;

    for (let i = 1; i <= 30; i++) {
      // 1. Cumulative Rent Outflow
      totalRentOutflow += currentRent * 12;

      // 2. Cumulative Buying Outflow (Loan/EMI payments)
      totalBuyingOutflow += rvbEmi * 12;

      // 3. Break-even check
      // Based on your definition: When Total Rent >= Total EMI spent
      if (breakEvenYear === -1 && totalRentOutflow >= totalBuyingOutflow) {
        breakEvenYear = i;
      }

      // 4. Set Results for the selected Horizon
      if (i === rvbHorizon) {
        const houseFutureValue = rvbPrice * Math.pow(1.1, i);

        setRvbResults({
          totalRent: Math.round(totalRentOutflow),
          totalEmi: Math.round(totalBuyingOutflow),
          futureValue: Math.round(houseFutureValue),
          // Net position still considers the asset you own
          netBuyingPosition: Math.round(houseFutureValue - totalBuyingOutflow),
          result:
            totalBuyingOutflow < totalRentOutflow
              ? "Buying is cheaper (Outflow)"
              : "Renting is cheaper (Outflow)",
          breakEven: breakEvenYear,
        });
      }

      // Rent increases annually
      currentRent *= 1.1;
    }
  };
  useEffect(() => {
    calculateAffordability();
    calculateEligibility();
    calculateOwnership();
    calculateRentVsBuy();
  }, [
    affIncome,
    affEmi,
    affDownPayment,
    affTenure,
    eligIncome,
    eligEmi,
    eligTenure,
    costPrice,
    costParking,
    rvbRent,
    rvbPrice,
    rvbEmi,
    rvbHorizon,
  ]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
            Financial Planning
          </h1>
          <p className="text-2xl font-serif italic text-primary">
            Safe Home Budget Calculator
          </p>
        </div>

        <Tabs
          defaultValue="affordability"
          className="max-w-5xl mx-auto w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <TabsList className="bg-secondary/50 h-auto p-1 flex-wrap justify-center">
              <TabsTrigger
                value="affordability"
                className="flex flex-col gap-2 py-4 px-6 min-w-[150px]"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs font-semibold">Affordability</span>
              </TabsTrigger>
              <TabsTrigger
                value="eligibility"
                className="flex flex-col gap-2 py-4 px-6 min-w-[150px]"
              >
                <Landmark className="h-5 w-5" />
                <span className="text-xs font-semibold">Eligibility</span>
              </TabsTrigger>
              <TabsTrigger
                value="ownership"
                className="flex flex-col gap-2 py-4 px-6 min-w-[150px]"
              >
                <Coins className="h-5 w-5" />
                <span className="text-xs font-semibold">Ownership Cost</span>
              </TabsTrigger>
              <TabsTrigger
                value="rent-vs-buy"
                className="flex flex-col gap-2 py-4 px-6 min-w-[150px]"
              >
                <Scale className="h-5 w-5" />
                <span className="text-xs font-semibold">Rent vs Buy</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="affordability">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 shadow-sm p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Net Monthly Income (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={affIncome.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setAffIncome(Number(e.target.value.replace(/,/g, "")))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Existing Monthly EMIs (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={affEmi.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setAffEmi(Number(e.target.value.replace(/,/g, "")))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Down Payment (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={affDownPayment.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setAffDownPayment(
                          Number(e.target.value.replace(/,/g, "")),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Tenure (Years)</Label>
                    <Select value={affTenure} onValueChange={setAffTenure}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20 Years</SelectItem>
                        <SelectItem value="25">25 Years</SelectItem>
                        <SelectItem value="30">30 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
              <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col justify-center space-y-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                    Max Monthly EMI
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(affResults.maxEmi)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                    Estimated Loan Amount
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(affResults.loanAmount)}
                  </p>
                </div>
                <div className="text-center pt-4 border-t border-primary/10">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                    Affordable Property Price
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(affResults.propertyPrice)}
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="eligibility">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 shadow-sm p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Net Monthly Income (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={eligIncome.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setEligIncome(Number(e.target.value.replace(/,/g, "")))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Existing Monthly EMIs (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={eligEmi.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setEligEmi(Number(e.target.value.replace(/,/g, "")))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Tenure (Years)</Label>
                    <Select value={eligTenure} onValueChange={setEligTenure}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20 Years</SelectItem>
                        <SelectItem value="25">25 Years</SelectItem>
                        <SelectItem value="30">30 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
              <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col justify-center space-y-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                    Eligible Loan Amount
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(eligResults.loanAmount)}
                  </p>
                </div>
                <div className="text-center pt-4 border-t border-primary/10">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                    Estimated Monthly EMI
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(eligResults.monthlyEmi)}
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ownership">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 shadow-sm p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Property Price (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={costPrice.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setCostPrice(Number(e.target.value.replace(/,/g, "")))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parking Required</Label>
                    <RadioGroup
                      value={costParking}
                      onValueChange={setCostParking}
                      className="flex gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pyes" />
                        <Label htmlFor="pyes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pno" />
                        <Label htmlFor="pno">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>
              <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col justify-center space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">
                    Stamp Duty (7%)
                  </span>
                  <span className="font-bold">
                    {formatCurrency(costResults.stampDuty)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">
                    GST (5%)
                  </span>
                  <span className="font-bold">
                    {formatCurrency(costResults.gst)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">
                    Parking Cost
                  </span>
                  <span className="font-bold">
                    {formatCurrency(costResults.parking)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                  <span className="text-base font-bold uppercase tracking-widest">
                    Total Ownership Cost
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(costResults.total)}
                  </span>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rent-vs-buy">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 shadow-sm p-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly Rent (₹)</Label>
                      <Input
                        type="text"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={rvbRent.toLocaleString("en-IN")}
                        onChange={(e) =>
                          setRvbRent(Number(e.target.value.replace(/,/g, "")))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Property Price (₹)</Label>
                      <Input
                        type="text"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={rvbPrice.toLocaleString("en-IN")}
                        onChange={(e) =>
                          setRvbPrice(Number(e.target.value.replace(/,/g, "")))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly EMI (₹)</Label>
                      <Input
                        type="text"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={rvbEmi.toLocaleString("en-IN")}
                        onChange={(e) =>
                          setRvbEmi(Number(e.target.value.replace(/,/g, "")))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Horizon (Years)</Label>
                      <Input
                        type="number"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={rvbHorizon}
                        onChange={(e) => setRvbHorizon(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col justify-center space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">
                    Total Rent Paid
                  </span>
                  <span className="font-bold">
                    {formatCurrency(rvbResults.totalRent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">
                    Total EMI Paid
                  </span>
                  <span className="font-bold">
                    {formatCurrency(rvbResults.totalEmi)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">
                    Future Property Value
                  </span>
                  <span className="font-bold">
                    {formatCurrency(rvbResults.futureValue)}
                  </span>
                </div>
                {rvbResults.breakEven !== -1 && (
                  <div className="flex justify-between items-center border-t border-primary/10 pt-4">
                    <span className="text-sm text-muted-foreground uppercase tracking-widest">
                      Break-even Point
                    </span>
                    <span className="font-bold text-green-600">
                      {rvbResults.breakEven} Years
                    </span>
                  </div>
                )}
                <div className="text-center pt-6 border-t border-primary/10">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2 font-bold">
                    Recommendation
                  </p>
                  <p
                    className={`text-3xl font-bold ${rvbResults.result === "Buying is better" ? "text-green-600" : "text-primary"}`}
                  >
                    {rvbResults.result}
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
