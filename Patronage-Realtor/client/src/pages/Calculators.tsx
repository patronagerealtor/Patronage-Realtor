"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Landmark,
  Coins,
  Scale,
  TrendingUp,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Utility for consistent coloring ---
const COLORS = {
  primary: "hsl(var(--primary))",
  chart: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
};

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("smart-emi");

  // --- 1. Loan Eligibility State ---
  const [eligIncome, setEligIncome] = useState(100000);
  const [eligEmi, setEligEmi] = useState(0);
  const [eligInterestRate, setEligInterestRate] = useState(8.5);
  const [eligTenure, setEligTenure] = useState(20);
  const [eligResults, setEligResults] = useState({
    loanAmount: 0,
    monthlyEmi: 0,
    maxEmi: 0,
  });

  // --- 2. Ownership Cost State ---
  const [costPrice, setCostPrice] = useState(5000000);
  const [costParking, setCostParking] = useState("no");
  const [costResults, setCostResults] = useState({
    stampDuty: 0,
    gst: 0,
    parking: 0,
    total: 0,
    breakdown: [] as { name: string; value: number }[],
  });

  // --- 3. Rent vs Buy State ---
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
    graphData: [] as {
      year: number;
      Rent: number;
      EMI: number;
      AssetValue: number;
    }[],
  });

  // --- 4. Smart EMI State ---
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

  // Helper to handle currency inputs safely
  const handleCurrencyInput = (val: string, setter: (v: number) => void) => {
    const numberVal = Number(val.replace(/,/g, ""));
    if (!isNaN(numberVal)) setter(numberVal);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  // --- Calculation Logic ---

  const calculateEligibility = () => {
    if (eligInterestRate <= 0 || eligIncome <= 0 || eligTenure <= 0) return;

    // Use same rate as Smart EMI (8.5% default)
    const rate = eligInterestRate / 12 / 100;
    const months = eligTenure * 12;

    const disposableIncome = Math.max(0, eligIncome - eligEmi);

    // Using same logic as Smart EMI
    const safeMonthlyEmi = Math.max(0, disposableIncome * 0.4);
    const maxEmi = Math.max(0, disposableIncome * 0.5);

    const maxAffordableLoan =
      safeMonthlyEmi > 0
        ? safeMonthlyEmi *
          ((Math.pow(1 + rate, months) - 1) /
            (rate * Math.pow(1 + rate, months)))
        : 0;

    setEligResults({
      loanAmount: Math.round(maxAffordableLoan),
      monthlyEmi: Math.round(safeMonthlyEmi),
      maxEmi: Math.round(maxEmi),
    });
  };

  const calculateOwnership = () => {
    const stampDuty = costPrice * 0.07;
    const gst = costPrice * 0.05;
    const parking = costParking === "yes" ? 300000 : 0;

    const total = Math.round(costPrice + stampDuty + gst + parking);

    setCostResults({
      stampDuty: Math.round(stampDuty),
      gst: Math.round(gst),
      parking,
      total,
      breakdown: [
        { name: "Base Price", value: costPrice },
        { name: "Stamp Duty", value: Math.round(stampDuty) },
        { name: "GST", value: Math.round(gst) },
        { name: "Parking", value: parking },
      ],
    });
  };

  const calculateRentVsBuy = () => {
    let totalRentOutflow = 0;
    let totalBuyingOutflow = 0;
    let currentRent = rvbRent;
    let breakEvenYear = -1;
    const graphData: {
      year: number;
      Rent: number;
      EMI: number;
      AssetValue: number;
    }[] = [];

    for (let i = 1; i <= smartTenure; i++) {
      totalRentOutflow += currentRent * 12;
      totalBuyingOutflow += rvbEmi * 12;

      if (breakEvenYear === -1 && totalRentOutflow >= totalBuyingOutflow) {
        breakEvenYear = i;
      }

      const houseFutureValue = rvbPrice * Math.pow(1.07, i);

      graphData.push({
        year: i,
        Rent: Math.round(totalRentOutflow),
        EMI: Math.round(totalBuyingOutflow),
        AssetValue: Math.round(houseFutureValue),
      });

      // Capture results strictly at the selected horizon year
      if (i === rvbHorizon) {
        setRvbResults((prev) => ({
          ...prev,
          totalRent: Math.round(totalRentOutflow),
          totalEmi: Math.round(totalBuyingOutflow),
          futureValue: Math.round(houseFutureValue),
          netBuyingPosition: Math.round(houseFutureValue - totalBuyingOutflow),
          result:
            totalBuyingOutflow < totalRentOutflow
              ? "Buying is cheaper"
              : "Renting is cheaper",
          breakEven: breakEvenYear,
        }));
      }
      currentRent *= 1.1;
    }
    setRvbResults((prev) => ({ ...prev, graphData }));
  };

  const calculateSmartEmi = () => {
    if (
      smartLoanAmount <= 0 ||
      smartInterestRate <= 0 ||
      smartTenure <= 0 ||
      smartIncome <= 0
    )
      return;

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
    if (ratio > 50) risk = "High Risk";
    else if (ratio > 40) risk = "Moderate";

    const disposableIncome = smartIncome - smartExistingEmi;
    const safeMonthlyEmi = Math.max(0, disposableIncome * 0.4);

    const maxAffordableLoan =
      safeMonthlyEmi > 0
        ? safeMonthlyEmi *
          ((Math.pow(1 + rate, months) - 1) /
            (rate * Math.pow(1 + rate, months)))
        : 0;

    let verdict = "Affordable";
    if (emi > disposableIncome * 0.5) verdict = "Risky";
    else if (emi > safeMonthlyEmi) verdict = "Stretch";

    // Update Shared state when Smart EMI calculation runs
    setEligIncome(smartIncome);
    setEligEmi(smartExistingEmi);
    setEligInterestRate(smartInterestRate);
    setEligTenure(smartTenure);

    setRvbPrice(smartLoanAmount);
    setRvbEmi(Math.round(emi));
    setRvbHorizon(Math.min(smartTenure, 30)); // Sync horizon as well if appropriate

    // Simplified Prepayment Logic
    let revisedMonths = 0;
    let totalInterestWithPrepayment = 0;

    if (smartPrepayment > 0) {
      let tempPrincipal = smartLoanAmount;
      while (tempPrincipal > 100 && revisedMonths < months) {
        revisedMonths++;
        const interestForMonth = tempPrincipal * rate;
        totalInterestWithPrepayment += interestForMonth;
        let principalComponent = emi - interestForMonth;
        principalComponent += smartPrepayment;
        if (principalComponent > tempPrincipal)
          principalComponent = tempPrincipal;
        tempPrincipal -= principalComponent;
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            Financial Planning Suite
          </h1>
          <p className="text-xl text-muted-foreground">
            Tools to make smarter home buying decisions
          </p>
        </div>

        <Tabs
          defaultValue="smart-emi"
          className="max-w-6xl mx-auto w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-muted p-1 grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto md:h-15">
              <TabsTrigger value="smart-emi" className="py-2.5 h-full">
                <Landmark className="h-4 w-4 mr-2" /> Smart EMI
              </TabsTrigger>
              <TabsTrigger value="rent-vs-buy" className="py-2.5 h-full">
                <Scale className="h-4 w-4 mr-2" /> Rent vs Buy
              </TabsTrigger>
              <TabsTrigger value="eligibility" className="py-2.5 h-full">
                <TrendingUp className="h-4 w-4 mr-2" /> Eligibility
              </TabsTrigger>
              <TabsTrigger value="ownership" className="py-2.5 h-full">
                <Coins className="h-4 w-4 mr-2" /> Ownership Cost
              </TabsTrigger>
            </TabsList>
          </div>
          {/* --- 1. Smart EMI Planner --- */}
          <TabsContent value="smart-emi">
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              <Card className="lg:col-span-5 p-6 space-y-6 h-full border-t-4 border-t-primary">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loan Amount (₹)</Label>
                    <Input
                      value={smartLoanAmount.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setSmartLoanAmount)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={smartInterestRate}
                        onChange={(e) =>
                          setSmartInterestRate(Number(e.target.value))
                        }
                      />
                    </div>
                    {/* HYBRID TENURE INPUT */}
                    <div className="space-y-2">
                      <Label>Tenure (Yrs)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          className="pr-12"
                          value={smartTenure}
                          onChange={(e) =>
                            setSmartTenure(Number(e.target.value))
                          }
                        />
                        <div className="absolute top-0 right-0 h-full">
                          <Select
                            onValueChange={(val) => setSmartTenure(Number(val))}
                          >
                            <SelectTrigger className="h-full w-12 rounded-l-none border-l bg-muted/20 px-2 focus:ring-0 focus:ring-offset-0 flex items-center justify-center">
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {[10, 15, 20, 25, 30].map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                  {y} Years
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Net Monthly Income (₹)</Label>
                    <Input
                      value={smartIncome.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setSmartIncome)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Prepayment (₹)</Label>
                    <Input
                      value={smartPrepayment.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setSmartPrepayment)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Extra amount you can pay monthly
                    </p>
                  </div>
                </div>
              </Card>

              <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
                {/* Visuals */}
                <Card className="p-6 flex flex-col justify-center items-center h-full">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Total Cost Breakdown
                  </h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Principal", value: smartLoanAmount },
                            {
                              name: "Interest",
                              value: smartResults.totalInterest,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill={COLORS.chart[0]} />
                          <Cell fill={COLORS.chart[1]} />
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Total Payable
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(smartResults.totalPayment)}
                    </p>
                  </div>
                </Card>

                {/* Stats */}
                <Card
                  className={`p-6 flex flex-col justify-between h-full ${
                    smartResults.riskLevel === "Safe"
                      ? "bg-green-50/50 dark:bg-green-900/10"
                      : "bg-red-50/50 dark:bg-red-900/10"
                  }`}
                >
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
                      Your Monthly EMI
                    </p>
                    <p className="text-4xl font-bold text-primary my-2">
                      {formatCurrency(smartResults.monthlyEmi)}
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          smartResults.riskLevel === "Safe"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {smartResults.riskLevel}
                      </span>
                      <span className="text-sm font-medium">
                        EMI is {smartResults.emiToIncomeRatio}% of Income
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6 pt-6 border-t border-dashed border-gray-300 dark:border-gray-700">
                    {smartPrepayment > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Interest Saved</span>
                        <span className="font-bold">
                          {formatCurrency(smartResults.interestSaved)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Safe Limit (40%)</span>
                      <span className="font-semibold">
                        {formatCurrency(smartResults.safeMonthlyEmi)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Max Affordable Loan</span>
                      <span className="font-semibold">
                        {formatCurrency(smartResults.maxAffordableLoan)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem
                value="logic"
                className="border rounded-lg bg-card px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <BookOpen className="h-4 w-4" />
                    Calculation Logic
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p>
                    The Smart EMI calculator uses the standard EMI formula:{" "}
                    <code>[P x R x (1+R)^N] / [(1+R)^N - 1]</code>
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Risk Level:</strong> Based on FOIR. Below 40% is
                      "Safe", 40-50% is "Moderate", above 50% is "High Risk".
                    </li>
                    <li>
                      <strong>Interest Saved:</strong> Projected by applying
                      prepayment directly to principal each month.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* --- 2. Rent vs Buy --- */}
          <TabsContent value="rent-vs-buy">
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              <Card className="lg:col-span-5 p-6 space-y-6 h-full">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent (₹)</Label>
                    <Input
                      value={rvbRent.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setRvbRent)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Price (₹)</Label>
                    <Input
                      value={rvbPrice.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setRvbPrice)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected EMI (₹)</Label>
                    <Input
                      value={rvbEmi.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setRvbEmi)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Analysis Horizon</Label>
                    <Select
                      value={rvbHorizon.toString()}
                      onValueChange={(val) => setRvbHorizon(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25, 30].map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y} Years
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-7 p-6 flex flex-col h-full">
                {/* Result Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 bg-muted/20 p-2 md:p-3 rounded-lg text-center md:text-left">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
                      Total Rent ({rvbHorizon}y)
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(rvbResults.totalRent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
                      Total EMI ({rvbHorizon}y)
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(rvbResults.totalEmi)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
                      Break-even
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {rvbResults.breakEven > 0
                        ? `Year ${rvbResults.breakEven}`
                        : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
                      Asset Value
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(rvbResults.futureValue)}
                    </p>
                  </div>
                </div>

                <div className="mb-6 text-center md:text-left">
                  <h3 className="text-xl font-bold">
                    Verdict:{" "}
                    <span
                      className={
                        rvbResults.result.includes("Buying")
                          ? "text-green-600"
                          : "text-blue-600"
                      }
                    >
                      {rvbResults.result}
                    </span>
                  </h3>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={rvbResults.graphData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.3}
                      />
                      <XAxis dataKey="year" tickLine={false} axisLine={false} />
                      <YAxis
                        tickFormatter={(val) => `₹${val / 100000}L`}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                      />
                      <Tooltip
                        formatter={(val: number) => formatCurrency(val)}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Rent"
                        stroke={COLORS.chart[2]}
                        strokeWidth={2}
                        name="Cumulative Rent"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="EMI"
                        stroke={COLORS.chart[3]}
                        strokeWidth={2}
                        name="Cumulative EMI"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="AssetValue"
                        stroke={COLORS.chart[1]}
                        strokeWidth={2}
                        name="Property Value"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem
                value="logic"
                className="border rounded-lg bg-card px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <BookOpen className="h-4 w-4" />
                    Calculation Logic
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p>
                    We compare the total cost of renting vs buying over your
                    selected horizon:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Rent Cost:</strong> Cumulative rent paid, assuming
                      a 10% annual increase.
                    </li>
                    <li>
                      <strong>Buy Cost:</strong> Cumulative EMI payments made
                      over the period.
                    </li>
                    <li>
                      <strong>Asset Value:</strong> Projected property value
                      assuming 7% annual appreciation.
                    </li>
                    <li>
                      <strong>Break-even:</strong> The year when cumulative rent
                      paid exceeds cumulative EMI paid.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* --- 3. Eligibility --- */}
          <TabsContent value="eligibility">
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              <Card className="lg:col-span-5 p-6 space-y-6 h-full">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Net Monthly Income (₹)</Label>
                    <Input
                      value={eligIncome.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setEligIncome)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current EMIs (₹)</Label>
                    <Input
                      value={eligEmi.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setEligEmi)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={eligInterestRate}
                        onChange={(e) =>
                          setEligInterestRate(Number(e.target.value))
                        }
                      />
                    </div>
                    {/* HYBRID TENURE INPUT */}
                    <div className="space-y-2">
                      <Label>Tenure (Yrs)</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          className="pr-12"
                          value={eligTenure}
                          onChange={(e) =>
                            setEligTenure(Number(e.target.value))
                          }
                        />
                        <div className="absolute top-0 right-0 h-full">
                          <Select
                            onValueChange={(val) => setEligTenure(Number(val))}
                          >
                            <SelectTrigger className="h-full w-12 rounded-l-none border-l bg-muted/20 px-2 focus:ring-0 focus:ring-offset-0 flex items-center justify-center">
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {[15, 20, 25, 30].map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                  {y} Years
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-7 p-8 flex flex-col items-center justify-center bg-primary/5 h-full">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  You are eligible for a loan of
                </p>
                <p className="text-5xl font-bold text-primary mt-2 mb-8">
                  {formatCurrency(eligResults.loanAmount)}
                </p>

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <span>
                    Max Recommended EMI: {formatCurrency(eligResults.maxEmi)}
                  </span>
                </div>
              </Card>
            </div>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem
                value="logic"
                className="border rounded-lg bg-card px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <BookOpen className="h-4 w-4" />
                    Calculation Logic
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p>
                    Loan eligibility is determined by your repayment capacity:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Disposable Income:</strong> Your monthly income
                      minus any existing EMIs.
                    </li>
                    <li>
                      <strong>Safe Monthly EMI:</strong> 40% of your disposable
                      income (Recommended limit).
                    </li>
                    <li>
                      <strong>Max EMI:</strong> 50% of your disposable income
                      (Maximum stretch limit).
                    </li>
                    <li>
                      <strong>Eligible Loan:</strong> Calculated by
                      reverse-engineering the EMI formula using the Safe EMI,
                      current Interest Rate, and Tenure.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* --- 4. Ownership Cost --- */}
          <TabsContent value="ownership">
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              <Card className="lg:col-span-5 p-6 space-y-6 h-full">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Base Property Price (₹)</Label>
                    <Input
                      value={costPrice.toLocaleString("en-IN")}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setCostPrice)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Car Parking?</Label>
                    <RadioGroup
                      value={costParking}
                      onValueChange={setCostParking}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="py" />
                        <Label htmlFor="py">Yes (+₹3L)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pn" />
                        <Label htmlFor="pn">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-7 p-6 flex flex-col justify-center h-full">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                      Total Ownership Cost
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {formatCurrency(costResults.total)}
                    </p>
                  </div>
                  <div className="space-y-3 pt-6 border-t">
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Stamp Duty (7%)</span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.stampDuty)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>GST (5%)</span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.gst)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Parking</span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.parking)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem
                value="logic"
                className="border rounded-lg bg-card px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <BookOpen className="h-4 w-4" />
                    Calculation Logic
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4 pb-4">
                  <p>
                    Total ownership cost includes the base price and mandatory
                    government charges:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Stamp Duty:</strong> Calculated at 7% of the
                      property price (state average).
                    </li>
                    <li>
                      <strong>GST:</strong> Calculated at 5% for
                      under-construction properties.
                    </li>
                    <li>
                      <strong>Parking:</strong> A fixed cost of ₹3,00,000 if
                      selected.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
