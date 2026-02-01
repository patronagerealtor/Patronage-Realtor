import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, Landmark, Coins, Scale, Paintbrush } from "lucide-react";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("smart-emi");

  // 1. Loan Eligibility
  const [eligIncome, setEligIncome] = useState(100000);
  const [eligEmi, setEligEmi] = useState(0);
  const [eligTenure, setEligTenure] = useState("20");
  const [eligResults, setEligResults] = useState({
    loanAmount: 0,
    monthlyEmi: 0,
  });

  // 2. Total Cost of Ownership
  const [costPrice, setCostPrice] = useState(5000000);
  const [costParking, setCostParking] = useState("no");
  const [costResults, setCostResults] = useState({
    stampDuty: 0,
    gst: 0,
    parking: 0,
    total: 0,
  });

  // 3. Rent vs Buy
  const [rvbRent, setRvbRent] = useState(20000);
  const [rvbPrice, setRvbPrice] = useState(5000000);
  const [rvbEmi, setRvbEmi] = useState(35000);
  const [rvbHorizon, setRvbHorizon] = useState(10);
  const [rvbResults, setRvbResults] = useState({
    totalRent: 0,
    totalEmi: 0,
    futureValue: 0,
    netBuyingPosition: 0,
    result: "",
    breakEven: -1,
  });

  // 4. Smart EMI Planner
  const [smartLoanAmount, setSmartLoanAmount] = useState(5000000);
  const [smartInterestRate, setSmartInterestRate] = useState(8.5);
  const [smartTenure, setSmartTenure] = useState(20);
  const [smartIncome, setSmartIncome] = useState(100000);
  const [smartExistingEmi, setSmartExistingEmi] = useState(0);
  const [smartPrepayment, setSmartPrepayment] = useState(0);
  const [smartResults, setSmartResults] = useState({
    monthlyEmi: 0,
    totalInterest: 0,
    totalPayment: 0,
    emiToIncomeRatio: 0,
    riskLevel: "Safe",
    revisedTenure: 0,
    interestSaved: 0,
    safeMonthlyEmi: 0,
    maxAffordableLoan: 0,
    purchaseVerdict: "Affordable",
  });

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
        const houseFutureValue = rvbPrice * Math.pow(1.07, i);

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
  const calculateSmartEmi = () => {
    // Basic input validation
    if (
      smartLoanAmount <= 0 ||
      smartInterestRate <= 0 ||
      smartTenure <= 0 ||
      smartIncome <= 0
    ) {
      setSmartResults({
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        emiToIncomeRatio: 0,
        riskLevel: "Safe",
        revisedTenure: 0,
        interestSaved: 0,
        safeMonthlyEmi: 0,
        maxAffordableLoan: 0,
        purchaseVerdict: "Affordable",
      });
      return;
    }

    const rate = smartInterestRate / 12 / 100;
    const months = smartTenure * 12;
    const emi =
      (smartLoanAmount * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - smartLoanAmount;

    const totalEmiLoad = emi + smartExistingEmi;
    const ratio = (totalEmiLoad / smartIncome) * 100;

    let risk = "Safe";
    if (ratio > 40) risk = "High Risk";
    else if (ratio > 30) risk = "Moderate";

    // Affordability Logic Integration
    const disposableIncome = smartIncome - smartExistingEmi;
    const safeMonthlyEmi = Math.max(0, disposableIncome * 0.4);

    // Invert EMI formula to get max affordable loan
    // P = (EMI * ((1 + r)^n - 1)) / (r * (1 + r)^n)
    const maxAffordableLoan =
      safeMonthlyEmi > 0
        ? safeMonthlyEmi *
          ((Math.pow(1 + rate, months) - 1) /
            (rate * Math.pow(1 + rate, months)))
        : 0;

    let verdict = "Affordable";
    if (emi > disposableIncome * 0.5) verdict = "Risky";
    else if (emi > safeMonthlyEmi) verdict = "Stretch";

    // Prepayment logic
    let revisedMonths = 0;
    let totalInterestWithPrepayment = 0;
    let remainingPrincipal = smartLoanAmount;

    if (smartPrepayment > 0) {
      while (remainingPrincipal > 0 && revisedMonths < months) {
        revisedMonths++;
        const interestForMonth = remainingPrincipal * rate;
        totalInterestWithPrepayment += interestForMonth;
        const principalFromEmi = Math.min(
          emi - interestForMonth,
          remainingPrincipal,
        );
        remainingPrincipal -= principalFromEmi;

        if (remainingPrincipal > 0) {
          const extraPayment = Math.min(smartPrepayment, remainingPrincipal);
          remainingPrincipal -= extraPayment;
        }
      }
    } else {
      revisedMonths = months;
      totalInterestWithPrepayment = totalInterest;
    }

    setSmartResults({
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      emiToIncomeRatio: Math.round(ratio * 10) / 10,
      riskLevel: risk,
      revisedTenure: revisedMonths,
      interestSaved: Math.max(
        0,
        Math.round(totalInterest - totalInterestWithPrepayment),
      ),
      safeMonthlyEmi: Math.round(safeMonthlyEmi),
      maxAffordableLoan: Math.round(maxAffordableLoan),
      purchaseVerdict: verdict,
    });
  };

  useEffect(() => {
    calculateRentVsBuy();
    calculateEligibility();
    calculateOwnership();
    calculateSmartEmi();
  }, [
    eligIncome,
    eligEmi,
    eligTenure,
    costPrice,
    costParking,
    rvbRent,
    rvbPrice,
    rvbEmi,
    rvbHorizon,
    smartLoanAmount,
    smartInterestRate,
    smartTenure,
    smartIncome,
    smartExistingEmi,
    smartPrepayment,
  ]);

  const formatCurrency = (val) =>
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
          defaultValue="smart-emi"
          className="max-w-5xl mx-auto w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <TabsList className="bg-secondary/50 h-auto p-1 flex-wrap justify-center">
              <TabsTrigger
                value="smart-emi"
                className="flex flex-col gap-2 py-4 px-6 min-w-[150px]"
              >
                <Landmark className="h-5 w-5" />
                <span className="text-xs font-semibold">Smart EMI Planner</span>
              </TabsTrigger>
              <TabsTrigger
                value="rent-vs-buy"
                className="flex flex-col gap-2 py-4 px-6 min-w-[150px]"
              >
                <Scale className="h-5 w-5" />
                <span className="text-xs font-semibold">Rent vs Buy</span>
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
            </TabsList>
          </div>

          {/* Smart EMI Planner Content */}
          <TabsContent value="smart-emi">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="border-2 shadow-sm p-6 space-y-6 lg:col-span-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loan Amount (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={smartLoanAmount.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setSmartLoanAmount(
                          Number(e.target.value.replace(/,/g, "")),
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={smartInterestRate}
                        onChange={(e) =>
                          setSmartInterestRate(Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tenure (Years)</Label>
                      <Select
                        value={smartTenure.toString()}
                        onValueChange={(val) => setSmartTenure(Number(val))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 Years</SelectItem>
                          <SelectItem value="20">20 Years</SelectItem>
                          <SelectItem value="25">25 Years</SelectItem>
                          <SelectItem value="30">30 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Net Income (₹) (After tax)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={smartIncome.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setSmartIncome(Number(e.target.value.replace(/,/g, "")))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Existing Monthly EMIs (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={smartExistingEmi.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setSmartExistingEmi(
                          Number(e.target.value.replace(/,/g, "")),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Extra Prepayment (₹)</Label>
                    <Input
                      type="text"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={smartPrepayment.toLocaleString("en-IN")}
                      onChange={(e) =>
                        setSmartPrepayment(
                          Number(e.target.value.replace(/,/g, "")),
                        )
                      }
                    />
                  </div>
                </div>
              </Card>

              <div className="lg:col-span-2 grid md:grid-cols-2 gap-8 h-fit">
                <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                      Monthly EMI
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {formatCurrency(smartResults.monthlyEmi)}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-primary/10 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Original Interest
                      </span>
                      <span className="font-bold">
                        {formatCurrency(smartResults.totalInterest)}
                      </span>
                    </div>
                    {smartPrepayment > 0 && (
                      <>
                        <div className="flex justify-between items-center text-green-600">
                          <span className="text-sm font-semibold">
                            Interest Saved
                          </span>
                          <span className="font-bold">
                            {formatCurrency(smartResults.interestSaved)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-green-600">
                          <span className="text-sm font-semibold">
                            Revised Tenure
                          </span>
                          <span className="font-bold">
                            {Math.floor(smartResults.revisedTenure / 12)}Y{" "}
                            {smartResults.revisedTenure % 12}M
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Amount
                      </span>
                      <span className="font-bold">
                        {formatCurrency(smartResults.totalPayment)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-primary/10 pt-6 text-center">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground uppercase tracking-widest">
                        EMI-to-Income Ratio
                      </span>
                      <span
                        className={`font-bold text-lg ${
                          smartResults.riskLevel === "Safe"
                            ? "text-green-600"
                            : smartResults.riskLevel === "Moderate"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {smartResults.emiToIncomeRatio}%
                      </span>
                    </div>

                    <div
                      className={`py-2 px-4 rounded-full text-sm font-bold uppercase tracking-widest inline-block ${
                        smartResults.riskLevel === "Safe"
                          ? "bg-green-100 text-green-700"
                          : smartResults.riskLevel === "Moderate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      Risk Level: {smartResults.riskLevel}
                    </div>
                  </div>

                  <div className="bg-secondary/30 p-3 rounded-lg text-center mt-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                      Safe Purchase Range
                    </p>
                    <p className="text-sm font-bold">
                      {formatCurrency(smartResults.maxAffordableLoan * 0.8)} –{" "}
                      {formatCurrency(smartResults.maxAffordableLoan)}
                    </p>
                  </div>
                </Card>

                <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary text-center">
                      Affordability Insight
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Safe Monthly EMI
                      </span>
                      <span className="font-bold">
                        {formatCurrency(smartResults.safeMonthlyEmi)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Max Affordable Loan
                      </span>
                      <span className="font-bold">
                        {formatCurrency(smartResults.maxAffordableLoan)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-primary/10 pt-6 bg-primary/5 -mx-8 px-8 pb-8 rounded-b-xl mt-auto">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary text-center">
                      Bank-Style Summary
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Recommended EMI Limit (40%)
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(smartResults.safeMonthlyEmi)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Your EMI</span>
                        <span className="font-semibold">
                          {formatCurrency(smartResults.monthlyEmi)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          EMI Status
                        </span>
                        <span
                          className={`font-bold ${
                            smartResults.riskLevel === "Safe"
                              ? "text-green-600"
                              : smartResults.riskLevel === "Moderate"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {smartResults.riskLevel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Purchase Verdict
                        </span>
                        <span
                          className={`font-bold ${
                            smartResults.purchaseVerdict === "Affordable"
                              ? "text-green-600"
                              : smartResults.purchaseVerdict === "Stretch"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {smartResults.purchaseVerdict}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Rent vs Buy Content */}
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
                      <Select
                        value={rvbHorizon.toString()}
                        onValueChange={(val) => setRvbHorizon(Number(val))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 Years</SelectItem>
                          <SelectItem value="20">20 Years</SelectItem>
                          <SelectItem value="25">25 Years</SelectItem>
                          <SelectItem value="30">30 Years</SelectItem>
                        </SelectContent>
                      </Select>
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

          {/* Eligibility Content */}
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

          {/* Ownership Cost Content */}
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
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
