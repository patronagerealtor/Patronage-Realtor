"use client";

import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
} from "../components/ui/accordion";
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
  const [costPropertyStatus, setCostPropertyStatus] =
    useState("under-construction");
  const [costGender, setCostGender] = useState<"male" | "female">("male");
  const [costPerSqft, setCostPerSqft] = useState(0);
  const [costArea, setCostArea] = useState(0);
  const [costMaintenanceYears, setCostMaintenanceYears] = useState(2);
  const [registrationCost, setRegistrationCost] = useState(0);
  const [advocateCost, setAdvocateCost] = useState(0);
  const [costResults, setCostResults] = useState({
    stampDuty: 0,
    gst: 0,
    tds: 0,
    maintenance: 0,
    registration: 0,
    advocate: 0,
    total: 0,
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
    // Remove all non-numeric characters except for the decimal point
    const cleanVal = val.replace(/[^0-9.]/g, "");
    const numberVal = parseFloat(cleanVal);
    if (!isNaN(numberVal)) {
      setter(numberVal);
    } else if (cleanVal === "") {
      setter(0);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

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
    // Base value for statutory charges
    const basePrice = costPrice;

    // Maintenance: (cost per sq.ft × area) × (years × 12 months)
    const maintenance =
      costPerSqft > 0 && costArea > 0
        ? (costPerSqft * costArea) * costMaintenanceYears * 12
        : 0;

    const stampDutyRate = costGender === "female" ? 0.06 : 0.07;
    const stampDuty = basePrice * stampDutyRate;

    const gst =
      costPropertyStatus === "under-construction" ? basePrice * 0.05 : 0;

    const tds = basePrice * 0.01;

    const total =
      basePrice +
      stampDuty +
      gst +
      tds +
      maintenance +
      registrationCost +
      advocateCost;

    setCostResults({
      stampDuty: Math.round(stampDuty),
      gst: Math.round(gst),
      tds: Math.round(tds),
      maintenance: Math.round(maintenance),
      registration: registrationCost,
      advocate: advocateCost,
      total: Math.round(total),
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

  // Run when Smart EMI inputs change — syncs to Rent vs Buy
  useEffect(() => {
    calculateSmartEmi();
  }, [
    smartLoanAmount,
    smartInterestRate,
    smartTenure,
    smartIncome,
    smartExistingEmi,
    smartPrepayment,
  ]);

  // Run when Rent vs Buy / Eligibility / Ownership inputs change — do NOT overwrite RVB
  useEffect(() => {
    calculateRentVsBuy();
    calculateEligibility();
    calculateOwnership();
  }, [
    eligIncome,
    eligEmi,
    eligTenure,
    eligInterestRate,
    costPrice,
    costPropertyStatus,
    costPerSqft,
    costArea,
    costMaintenanceYears,
    registrationCost,
    advocateCost,
    costGender,
    rvbRent,
    rvbPrice,
    rvbEmi,
    rvbHorizon,
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
            <TabsList className="bg-muted p-1 grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto md:h-15 overflow-visible">
              <TabsTrigger
                value="smart-emi"
                className="py-2.5 h-full transition-all duration-200 hover:shadow-md hover:scale-105 data-[state=inactive]:hover:bg-primary/15 data-[state=inactive]:hover:text-primary data-[state=active]:hover:shadow-lg data-[state=active]:hover:ring-2 data-[state=active]:hover:ring-primary/30"
              >
                <Landmark className="h-4 w-4 mr-2" /> Smart EMI
              </TabsTrigger>
              <TabsTrigger
                value="rent-vs-buy"
                className="py-2.5 h-full transition-all duration-200 hover:shadow-md hover:scale-105 data-[state=inactive]:hover:bg-primary/15 data-[state=inactive]:hover:text-primary data-[state=active]:hover:shadow-lg data-[state=active]:hover:ring-2 data-[state=active]:hover:ring-primary/30"
              >
                <Scale className="h-4 w-4 mr-2" /> Rent vs Buy
              </TabsTrigger>
              <TabsTrigger
                value="eligibility"
                className="py-2.5 h-full transition-all duration-200 hover:shadow-md hover:scale-105 data-[state=inactive]:hover:bg-primary/15 data-[state=inactive]:hover:text-primary data-[state=active]:hover:shadow-lg data-[state=active]:hover:ring-2 data-[state=active]:hover:ring-primary/30"
              >
                <TrendingUp className="h-4 w-4 mr-2" /> Eligibility
              </TabsTrigger>
              <TabsTrigger
                value="ownership"
                className="py-2.5 h-full transition-all duration-200 hover:shadow-md hover:scale-105 data-[state=inactive]:hover:bg-primary/15 data-[state=inactive]:hover:text-primary data-[state=active]:hover:shadow-lg data-[state=active]:hover:ring-2 data-[state=active]:hover:ring-primary/30"
              >
                <Coins className="h-4 w-4 mr-2" /> Ownership Cost
              </TabsTrigger>
            </TabsList>
          </div>
          {/* --- 1. Smart EMI Planner --- */}
          <TabsContent value="smart-emi">
            <div className="grid lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 p-6 space-y-6 h-fit border-t-4 border-t-primary">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loan Amount (₹)</Label>
                    <Input
                      type="text"
                      value={
                        smartLoanAmount === 0
                          ? ""
                          : smartLoanAmount.toLocaleString("en-IN")
                      }
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setSmartLoanAmount)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest (%)</Label>
                      <Input
                        type="text"
                        value={smartInterestRate === 0 ? "" : smartInterestRate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d*$/.test(val)) {
                            setSmartInterestRate(val === "" ? 0 : Number(val));
                          }
                        }}
                      />
                    </div>
                    {/* HYBRID TENURE INPUT */}
                    <div className="space-y-2">
                      <Label>Tenure (Yrs)</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          className="pr-12"
                          value={smartTenure === 0 ? "" : smartTenure}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d*$/.test(val)) {
                              setSmartTenure(val === "" ? 0 : Number(val));
                            }
                          }}
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
                      type="text"
                      value={
                        smartIncome === 0
                          ? ""
                          : smartIncome.toLocaleString("en-IN")
                      }
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setSmartIncome)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Prepayment (₹)</Label>
                    <Input
                      type="text"
                      value={
                        smartPrepayment === 0
                          ? ""
                          : smartPrepayment.toLocaleString("en-IN")
                      }
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

              <div className="lg:col-span-7 grid md:grid-cols-2 gap-6 h-fit content-start">
                {/* Visuals */}
                <Card className="p-6 flex flex-col justify-center items-center h-fit min-h-full">
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
                  className={`p-6 flex flex-col justify-between h-fit min-h-full ${
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

            <Card className="mt-8 border rounded-lg bg-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                <BookOpen className="h-5 w-5 shrink-0" />
                <h3 className="text-lg">How Smart EMI Calculator Works</h3>
              </div>
              <div className="space-y-6 text-muted-foreground text-sm md:text-base leading-relaxed">
                <div>
                  <h4 className="font-bold text-foreground mb-2">What it calculates</h4>
                  <p>
                    Enter your loan amount, interest rate, and tenure. The calculator shows your monthly EMI, total interest over the loan period, and how much you will pay in total. It also checks if your EMI fits comfortably within your income (using a 40% safe limit) and tells you the risk level—Safe, Moderate, or High.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Why it matters</h4>
                  <p>
                    Buying a home is a long-term commitment. The Smart EMI calculator helps you see if you can afford the loan without stress, plan your budget, and understand the impact of paying a little extra each month. Knowing your safe EMI limit helps you avoid overstretching and stay financially secure.
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem
                    value="faq-1"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        What is the &quot;Safe EMI&quot; limit?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p>
                        A safe EMI is the amount you can pay without financial stress.
                        Financial experts recommend that your total EMI should not exceed 40% of your monthly income.
                        The calculator checks your EMI against this limit to keep you financially secure.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="faq-2"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        What do the risk levels mean?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">
                        The calculator assigns a risk level based on your EMI:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Safe</strong> – EMI is comfortably within limits</li>
                        <li><strong>Moderate</strong> – EMI is manageable but leaves less room for savings</li>
                        <li><strong>High Risk</strong> – EMI is too high and may cause financial stress</li>
                      </ul>
                      <p className="mt-2">
                        This helps you decide if you should reduce your loan amount or increase tenure.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="faq-3"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        What happens if I make extra monthly payments (prepayment)?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">If you add a monthly prepayment:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>The extra amount goes directly toward reducing your loan principal</li>
                        <li>Your total interest reduces</li>
                        <li>Your loan tenure becomes shorter</li>
                      </ul>
                      <p className="mb-2">The calculator shows:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>How much interest you can save</li>
                        <li>How many years you can cut from your loan</li>
                      </ul>
                      <p>Even small prepayments can save lakhs of rupees over time.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="faq-4"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        Why should I use this calculator before buying a home?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">
                        A home loan is a long-term commitment, often for 20–30 years. This calculator helps you:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Avoid over-stretching your finances</li>
                        <li>Plan your budget confidently</li>
                        <li>Understand the true cost of your loan</li>
                        <li>Make informed decisions before speaking to banks or builders</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>

          {/* --- 2. Rent vs Buy --- */}
          <TabsContent value="rent-vs-buy">
            <div className="grid lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 p-6 space-y-6 h-fit">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent (₹)</Label>
                    <Input
                      type="text"
                      value={
                        rvbRent === 0 ? "" : rvbRent.toLocaleString("en-IN")
                      }
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setRvbRent)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Price (₹)</Label>
                    <Input
                      type="text"
                      value={
                        rvbPrice === 0 ? "" : rvbPrice.toLocaleString("en-IN")
                      }
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setRvbPrice)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected EMI (₹)</Label>
                    <Input
                      type="text"
                      value={rvbEmi === 0 ? "" : rvbEmi.toLocaleString("en-IN")}
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

              <Card className="lg:col-span-7 p-6 flex flex-col h-fit">
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

            <Card className="mt-8 border rounded-lg bg-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                <BookOpen className="h-5 w-5 shrink-0" />
                <h3 className="text-lg">How Rent vs Buy Calculator Works</h3>
              </div>
              <div className="space-y-6 text-muted-foreground text-sm md:text-base leading-relaxed">
                <div>
                  <h4 className="font-medium text-foreground mb-2">What it calculates</h4>
                  <p>
                    Enter your monthly rent, property price, expected EMI, and how many years you plan to stay (analysis horizon). The calculator compares the total cost of renting versus buying over that period. It assumes rent increases by 10% every year and property value grows at 7% annually. You get total rent paid, total EMI paid, the break-even year (when buying becomes cheaper than renting), and the projected property value at the end.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key metrics explained</h4>
                  <p>
                    <strong>Total Rent</strong> – What you would pay in rent over the horizon. <strong>Total EMI</strong> – What you would pay toward the home loan. <strong>Asset Value</strong> – What the property could be worth in the future. <strong>Break-even</strong> – The year when cumulative rent paid exceeds cumulative EMI paid, meaning buying starts to make more sense.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Why it matters</h4>
                  <p>
                    Deciding between renting and buying is one of the biggest financial choices you will make. This calculator gives you a clear, numbers-based view so you can see which option fits your situation better. Whether you plan to stay for 5 years or 20, it helps you make an informed decision and feel confident about your choice.
                  </p>
                </div>
              </div>
              {/* FAQs */}
<div className="mt-10 pt-8 border-t border-border">
  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
    <BookOpen className="h-5 w-5 text-primary shrink-0" />
    Frequently Asked Questions
  </h3>

  <Accordion type="single" collapsible className="space-y-2">
    <AccordionItem
      value="rvb-faq-1"
      className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
    >
      <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        <span className="text-left font-bold text-foreground pr-4">
          How does the calculator compare renting and buying?
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
        <p>
          The calculator compares both options over the same time period. For renting,
          it calculates the total rent you would pay assuming rent increases every year.
          For buying, it calculates the total EMI paid and estimates the future value of
          the property. This side-by-side comparison helps you see which option costs less
          over your planned stay.
        </p>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem
      value="rvb-faq-2"
      className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
    >
      <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        <span className="text-left font-bold text-foreground pr-4">
          What does Asset Value mean?
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
        <p>
          Asset Value is the estimated value of the property at the end of your selected
          time period. The calculator assumes the property value increases every year.
          This shows the long-term value you may build by owning a home.
        </p>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem
      value="rvb-faq-3"
      className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
    >
      <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        <span className="text-left font-bold text-foreground pr-4">
          Does this calculator mean buying is always better?
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
        <p>
          No. The result depends on how long you plan to stay in the property and your
          financial situation. For shorter stays, renting may make more sense. For longer
          stays, buying may become more beneficial. The calculator helps you decide based
          on numbers, not assumptions.
        </p>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem
      value="rvb-faq-4"
      className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
    >
      <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        <span className="text-left font-bold text-foreground pr-4">
          Why does the calculator assume rent and property value increases?
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
        <p>
          Rent generally increases over time due to inflation and demand. Property values
          also tend to grow in the long term. These assumptions help create a realistic
          comparison, though actual future values may vary depending on market conditions.
        </p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>

            </Card>
          </TabsContent>

          {/* --- 3. Eligibility --- */}
          <TabsContent value="eligibility">
            <div className="grid lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Net Monthly Income (₹)</Label>
                    <Input
                      type="text"
                      value={
                        eligIncome === 0
                          ? ""
                          : eligIncome.toLocaleString("en-IN")
                      }
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setEligIncome)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current EMIs (₹)</Label>
                    <Input
                      type="text"
                      value={
                        eligEmi === 0 ? "" : eligEmi.toLocaleString("en-IN")
                      }
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setEligEmi)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest (%)</Label>
                      <Input
                        type="text"
                        value={eligInterestRate === 0 ? "" : eligInterestRate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d*$/.test(val)) {
                            setEligInterestRate(val === "" ? 0 : Number(val));
                          }
                        }}
                      />
                    </div>
                    {/* HYBRID TENURE INPUT */}
                    <div className="space-y-2">
                      <Label>Tenure (Yrs)</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          className="pr-12"
                          value={eligTenure === 0 ? "" : eligTenure}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d*$/.test(val)) {
                              setEligTenure(val === "" ? 0 : Number(val));
                            }
                          }}
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

              <Card className="lg:col-span-7 p-8 flex flex-col items-center justify-center bg-primary/5 min-h-full">
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

            <Card className="mt-8 border rounded-lg bg-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                <BookOpen className="h-5 w-5 shrink-0" />
                <h3 className="text-lg">How Eligibility Calculator Works</h3>
              </div>
              <div className="space-y-6 text-muted-foreground text-sm md:text-base leading-relaxed">
                <div>
                  <h4 className="font-medium text-foreground mb-2">What it calculates</h4>
                  <p>
                    Enter your net monthly income, any current EMIs you pay, the interest rate you expect, and the loan tenure. The calculator works out how much loan you can afford. It uses your disposable income (income minus existing EMIs), applies a safe limit of 40% for recommended EMI and 50% for maximum EMI, then reverse-engineers the EMI formula to tell you the eligible loan amount and the max recommended EMI you can take on.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key terms</h4>
                  <p>
                    <strong>Disposable income</strong> – Your monthly income after deducting existing EMIs. <strong>Safe Monthly EMI</strong> – 40% of disposable income (recommended limit). <strong>Max EMI</strong> – 50% of disposable income (upper limit). <strong>Eligible loan</strong> – The loan amount you can service at the safe EMI for the given rate and tenure.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Why it matters</h4>
                  <p>
                    Knowing your eligibility before you shop helps you set a realistic budget and talk to banks with confidence. The calculator keeps you within safe limits so you don’t overcommit and can plan your finances better.
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem
                    value="elig-faq-1"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        How does the calculator decide my eligibility?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">
                        The calculator first calculates your disposable income by subtracting your existing EMIs from your monthly income. From this disposable income:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>Forty percent is considered a safe monthly EMI limit</li>
                        <li>Fifty percent is considered the maximum EMI limit</li>
                      </ul>
                      <p>
                        Using the safe EMI limit, the calculator reverse-calculates the loan amount you can comfortably service for the chosen interest rate and tenure.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="elig-faq-2"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        What is disposable income?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p>
                        Disposable income is the amount of money you have left each month after paying your existing EMIs. This is the income available for taking on a new home loan safely.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="elig-faq-3"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        What is the Max EMI?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p>
                        The Max EMI is fifty percent of your disposable income. This represents the upper limit of what banks may allow, but it is considered a stretch and may reduce your financial flexibility.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="elig-faq-4"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        Why should I check eligibility before buying a home?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">Checking eligibility early helps you:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>Set a realistic property budget</li>
                        <li>Avoid loan rejections later</li>
                        <li>Negotiate confidently with banks</li>
                        <li>Prevent financial overcommitment</li>
                      </ul>
                      <p>It ensures you choose a home that fits your long-term financial comfort.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="elig-faq-5"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        Is this calculator the same as what banks use?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p>
                        The calculator follows the same core principles used by banks, such as income-based EMI limits and standard loan formulas. Actual bank approvals may vary slightly based on credit score, employment type, and other factors, but this calculator provides a reliable estimate.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>

          {/* --- 4. Ownership Cost --- */}
          <TabsContent value="ownership">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* INPUTS */}
              <Card className="lg:col-span-5 p-6 space-y-6">
                <div className="space-y-4">
                  {/* Buyer Gender - First */}
                  <div className="space-y-2">
                    <Label>Buyer Gender</Label>
                    <div className="flex gap-3" role="radiogroup" aria-label="Buyer gender">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={costGender === "male"}
                        onClick={() => setCostGender("male")}
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                          costGender === "male"
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:border-primary/30"
                        }`}
                      >
                        Male (7%)
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={costGender === "female"}
                        onClick={() => setCostGender("female")}
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                          costGender === "female"
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:border-primary/30"
                        }`}
                      >
                        Female (6%)
                      </button>
                    </div>
                  </div>

                  {/* Base Price */}
                  <div className="space-y-2">
                    <Label>Base Property Price (₹)</Label>
                    <Input
                      type="text"
                      value={
                        costPrice === 0 ? "" : costPrice.toLocaleString("en-IN")
                      }
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setCostPrice)
                      }
                    />
                  </div>

                  {/* Property Status */}
                  <div className="space-y-2">
                    <Label>Property Status</Label>
                    <RadioGroup
                      value={costPropertyStatus}
                      onValueChange={setCostPropertyStatus}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="under-construction" id="uc" />
                        <Label htmlFor="uc">Under Construction</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ready-to-move" id="rm" />
                        <Label htmlFor="rm">Ready to Move</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Cost per sqft + Area */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cost per sq.ft (₹)</Label>
                      <Input
                        type="text"
                        value={costPerSqft === 0 ? "" : costPerSqft}
                        onChange={(e) =>
                          handleCurrencyInput(e.target.value, setCostPerSqft)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Area (sq.ft)</Label>
                      <Input
                        type="text"
                        value={costArea === 0 ? "" : costArea}
                        onChange={(e) =>
                          handleCurrencyInput(e.target.value, setCostArea)
                        }
                      />
                    </div>
                  </div>

                  {/* Number of years (maintenance) */}
                  <div className="space-y-2">
                    <Label>Number of years (maintenance)</Label>
                    <Select
                      value={costMaintenanceYears.toString()}
                      onValueChange={(val) =>
                        setCostMaintenanceYears(Number(val))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y} {y === 1 ? "Year" : "Years"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Total maintenance = (Cost per sq.ft × Area) × 12 × years
                    </p>
                  </div>

                  {/* Registration */}
                  <div className="space-y-2">
                    <Label>Registration Cost (₹)</Label>
                    <Input
                      type="text"
                      value={registrationCost === 0 ? "" : registrationCost}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setRegistrationCost)
                      }
                    />
                  </div>

                  {/* Advocate */}
                  <div className="space-y-2">
                    <Label>Advocate Cost (₹)</Label>
                    <Input
                      type="text"
                      value={advocateCost === 0 ? "" : advocateCost}
                      onChange={(e) =>
                        handleCurrencyInput(e.target.value, setAdvocateCost)
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* RESULTS */}
              <Card className="lg:col-span-7 p-6 flex flex-col justify-center min-h-full">
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
                      <span>
                        Stamp Duty (
                        {costGender === "female" ? "6%" : "7%"}
                        )
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.stampDuty)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>
                        GST (
                        {costPropertyStatus === "under-construction"
                          ? "5%"
                          : "0%"}
                        )
                      </span>

                      <span className="font-semibold">
                        {formatCurrency(costResults.gst)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>TDS (1%)</span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.tds)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>
                        Maintenance ({costMaintenanceYears}{" "}
                        {costMaintenanceYears === 1 ? "Year" : "Years"})
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.maintenance)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Registration</span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.registration)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Advocate</span>
                      <span className="font-semibold">
                        {formatCurrency(costResults.advocate)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mt-8 border rounded-lg bg-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                <BookOpen className="h-5 w-5 shrink-0" />
                <h3 className="text-lg">How Ownership Cost Calculator Works</h3>
              </div>
              <div className="space-y-6 text-muted-foreground text-sm md:text-base leading-relaxed">
                <div>
                  <h4 className="font-medium text-foreground mb-2">What it calculates</h4>
                  <p>
                    Enter the base property price, your gender (for stamp duty rate), property status (under construction or ready to move), cost per sq.ft, area, number of years for maintenance, and any registration or advocate charges. The calculator adds stamp duty, GST (if under construction), TDS, maintenance over the chosen years, plus your optional charges to give you the total cost of ownership.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key components</h4>
                  <p>
                    <strong>Stamp duty</strong> – 7% for male buyers, 6% for female buyers, on the base price. <strong>GST</strong> – 5% for under-construction properties, 0% for ready-to-move. <strong>TDS</strong> – 1% of property value. <strong>Maintenance</strong> – (Cost per sq.ft × Area) × 12 × selected years. <strong>Registration & advocate</strong> – You enter these amounts if applicable.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Why it matters</h4>
                  <p>
                    Buying a property involves more than the listed price. This calculator shows you the full amount you will need—including taxes and other charges—so you can budget accurately and avoid surprises at the time of purchase.
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem
                    value="own-faq-1"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        How is stamp duty calculated?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">Stamp duty is calculated based on the buyer&apos;s gender:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>For male buyers, stamp duty is calculated at seven percent of the base property price</li>
                        <li>For female buyers, stamp duty is calculated at six percent of the base property price</li>
                      </ul>
                      <p>This reflects the benefit offered to female buyers in many states.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="own-faq-2"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        What is TDS and how is it calculated?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p>
                        TDS stands for Tax Deducted at Source. It is calculated as one percent of the base property price and is applicable as per current tax rules when purchasing property above the specified value.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="own-faq-3"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        How is maintenance cost calculated?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">Maintenance cost is calculated using the following method:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>First, the monthly maintenance is calculated by multiplying the cost per square foot with the total area</li>
                        <li>Then, this monthly amount is multiplied by twelve and by the number of years selected</li>
                      </ul>
                      <p>This gives the total maintenance amount collected in advance.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="own-faq-4"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        What are registration and advocate charges?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p>
                        Registration and advocate charges are additional costs involved in the legal transfer of the property. These amounts can vary, so the calculator allows you to enter them manually if applicable.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="own-faq-5"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        Why should I use the Ownership Cost Calculator?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">Many buyers focus only on the property price and underestimate additional costs. This calculator helps you:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>Plan your finances accurately</li>
                        <li>Avoid last minute surprises</li>
                        <li>Understand the true cost of ownership</li>
                        <li>Make informed decisions before finalizing a property</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="own-faq-6"
                    className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-medium text-foreground pr-4">
                        Is this calculator accurate for real life purchases?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p>
                        The calculator follows commonly used real world rules and government charges. Actual amounts may vary slightly depending on state laws, builder policies, and individual agreements, but the calculator provides a reliable and practical estimate.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
