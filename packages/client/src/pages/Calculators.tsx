"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link, useLocation } from "wouter";
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
  MapPin,
  Building2,
  Home,
} from "lucide-react";
import { useProperties } from "../hooks/use-properties";
import type { PropertyRow } from "../lib/supabase";
import { formatIndianPrice, getDisplayPrice } from "../lib/formatIndianPrice";
import { PlaceholderImage } from "../components/shared/PlaceholderImage";
import { SupabaseImage } from "../components/shared/SupabaseImage";
import { PropertyDetailDialog } from "../components/property-detail/PropertyDetailDialog";
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

const RELATED_PROPERTY_MARGIN_RUPEE = 500000; // ±5 Lakh (in rupees)

/** Get property price in lakhs for comparison. Uses price_value; then price_min/price_max; fallback: parse price string. */
function getPriceInLakhs(p: PropertyRow): number | null {
  const pv = p.price_value != null ? Number(p.price_value) : null;
  if (pv != null && !Number.isNaN(pv)) {
    if (pv >= 100000) return pv / 1e5;
    if (pv >= 100) return pv;
    if (pv >= 1) return pv * 100; // crore
    return pv;
  }
  if (p.price_min != null && p.price_max != null) {
    const mid = (Number(p.price_min) + Number(p.price_max)) / 2;
    if (!Number.isNaN(mid) && mid >= 100000) return mid / 1e5;
    if (!Number.isNaN(mid) && mid >= 100) return mid;
    if (!Number.isNaN(mid) && mid >= 1) return mid * 100;
    if (!Number.isNaN(mid)) return mid;
  }
  const str = (p.price ?? "").replace(/,/g, "");
  const crMatch = str.match(/(\d+(?:\.\d+)?)\s*cr(?:ore)?/i);
  if (crMatch) return parseFloat(crMatch[1]) * 100;
  const lakhMatch = str.match(/(\d+(?:\.\d+)?)\s*lakh/i);
  if (lakhMatch) return parseFloat(lakhMatch[1]);
  const numMatch = str.match(/[\d.]+/);
  if (numMatch) {
    const n = parseFloat(numMatch[0]);
    if (n >= 100000) return n / 1e5;
    if (n >= 100) return n;
    if (n >= 1) return n * 100;
    return n;
  }
  return null;
}

export default function Calculators() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("smart-emi");
  const { properties } = useProperties();
  const [detailProperty, setDetailProperty] = useState<PropertyRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Set activeTab based on URL path
  useEffect(() => {
    if (location === "/calculators/home-loan-emi-calculator") {
      setActiveTab("smart-emi");
    } else if (location === "/calculators/rent-vs-buy") {
      setActiveTab("rent-vs-buy");
    } else if (location === "/calculators/home-loan-eligibility") {
      setActiveTab("eligibility");
    } else if (location === "/calculators/ownership-cost") {
      setActiveTab("ownership");
    } else {
      setActiveTab("smart-emi");
    }
  }, [location]);

  // --- 1. Loan Eligibility State ---
  const [eligIncome, setEligIncome] = useState(100000);
  const [eligEmi, setEligEmi] = useState(0);
  const [eligInterestRate, setEligInterestRate] = useState("8.5");
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
  // Defaults mirror Smart EMI: property price = smartPropertyPrice default, emi = computed EMI at defaults, horizon = 20y
  const [rvbRent, setRvbRent] = useState(15000);
  const [rvbPrice, setRvbPrice] = useState(6000000);   // mirrors smartPropertyPrice default
  const [rvbEmi, setRvbEmi] = useState(43391);         // mirrors computed EMI at defaults (60L price, 50L loan, 8.5%, 20y)
  const [rvbHorizon, setRvbHorizon] = useState(20);    // default 20 years
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
  // NEW: Property Price is the primary input; Loan Amount is auto-derived but editable
  const [smartPropertyPrice, setSmartPropertyPrice] = useState(6000000);
  const [smartDownPayment, setSmartDownPayment] = useState(1000000);
  const [smartLoanAmount, setSmartLoanAmount] = useState(5000000); // auto = price - down
  const [smartLoanManuallyEdited, setSmartLoanManuallyEdited] = useState(false);
  const [smartInterestRate, setSmartInterestRate] = useState("8.5");
  const [smartTenure, setSmartTenure] = useState(20);
  const [smartIncome, setSmartIncome] = useState(100000);
  const [smartExistingEmi, setSmartExistingEmi] = useState(0);
  // NEW: Lump sum prepayment (replaces monthly prepayment)
  const [smartLumpSumPrepayment, setSmartLumpSumPrepayment] = useState(0);
  // NEW: Year at which lump sum prepayment is applied (0 = immediately)
  const [smartPrepaymentAfterYears, setSmartPrepaymentAfterYears] = useState(0);
  const [smartResults, setSmartResults] = useState({
    monthlyEmi: 0,
    totalInterest: 0,
    totalPayment: 0,
    emiToIncomeRatio: 0,
    riskLevel: "Safe",
    // NEW prepayment outputs
    originalTenureMonths: 0,
    revisedTenureMonths: 0,
    interestSaved: 0,
    yearsSaved: 0,
    safeMonthlyEmi: 0,
    maxAffordableLoan: 0,
    purchaseVerdict: "Affordable",
  });

  // Helper to handle currency inputs safely
  const handleCurrencyInput = (val: string, setter: (v: number) => void) => {
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

  // Format months into "X Yrs Y Mos" string
  const formatTenure = (months: number): string => {
    if (months <= 0) return "0 Mos";
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    if (yrs === 0) return `${mos} Mos`;
    if (mos === 0) return `${yrs} Yrs`;
    return `${yrs} Yrs ${mos} Mos`;
  };

  // --- Auto-derive Loan Amount when Property Price or Down Payment changes ---
  // Only auto-derive when the user has NOT manually edited the loan amount field
  useEffect(() => {
    if (!smartLoanManuallyEdited) {
      const derived = Math.max(0, smartPropertyPrice - smartDownPayment);
      setSmartLoanAmount(derived);
    }
  }, [smartPropertyPrice, smartDownPayment, smartLoanManuallyEdited]);

  // Reset manual-edit flag when property price or down payment changes (user is re-entering)
  // so that the auto-derive kicks back in unless they explicitly edit the loan field again
  const handlePropertyPriceChange = (val: string) => {
    setSmartLoanManuallyEdited(false);
    handleCurrencyInput(val, setSmartPropertyPrice);
  };

  const handleDownPaymentChange = (val: string) => {
    setSmartLoanManuallyEdited(false);
    handleCurrencyInput(val, setSmartDownPayment);
  };

  const handleLoanAmountChange = (val: string) => {
    setSmartLoanManuallyEdited(true);
    handleCurrencyInput(val, setSmartLoanAmount);
  };

  // --- Calculation Logic ---

  const calculateEligibility = () => {
    const eligRateNum = parseFloat(eligInterestRate) || 0;
    if (eligRateNum <= 0 || eligIncome <= 0 || eligTenure <= 0) return;

    const rate = eligRateNum / 12 / 100;
    const months = eligTenure * 12;

    const disposableIncome = Math.max(0, eligIncome - eligEmi);

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
    const basePrice = costPrice;

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

    for (let i = 1; i <= rvbHorizon; i++) {
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

      if (i === rvbHorizon) {
        const result =
          breakEvenYear === -1
            ? "Renting is cheaper"
            : rvbHorizon >= breakEvenYear
              ? "Buying is cheaper"
              : "Renting is cheaper";
        setRvbResults((prev) => ({
          ...prev,
          totalRent: Math.round(totalRentOutflow),
          totalEmi: Math.round(totalBuyingOutflow),
          futureValue: Math.round(houseFutureValue),
          netBuyingPosition: Math.round(houseFutureValue - totalBuyingOutflow),
          result,
          breakEven: breakEvenYear,
        }));
      }
      currentRent *= 1.1;
    }
    setRvbResults((prev) => ({ ...prev, graphData }));
  };

  const calculateSmartEmi = () => {
    const smartRateNum = parseFloat(smartInterestRate) || 0;
    if (
      smartLoanAmount <= 0 ||
      smartRateNum <= 0 ||
      smartTenure <= 0 ||
      smartIncome <= 0
    )
      return;

    const rate = smartRateNum / 12 / 100;
    const months = smartTenure * 12;

    // EMI calculated on actual loan amount (property price - down payment)
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

    // Sync shared state for Eligibility only — Rent vs Buy inputs remain independent
    setEligIncome(smartIncome);
    setEligEmi(smartExistingEmi);
    setEligInterestRate(smartInterestRate);
    setEligTenure(smartTenure);

    // --- Lump Sum Prepayment Logic (SBI style, with timing support) ---
    // Stage 1: amortize normally until prepayment year; Stage 2: apply lump sum; Stage 3: recalculate remaining tenure
    let revisedTenureMonths = months; // default: no prepayment

    if (smartLumpSumPrepayment > 0 && smartLumpSumPrepayment < smartLoanAmount) {
      // Stage 1 — run amortization loop up to prepayment month to get outstanding balance
      const monthsBeforePrepayment = smartPrepaymentAfterYears * 12;
      let balance = smartLoanAmount;
      for (let i = 0; i < monthsBeforePrepayment; i++) {
        const interest = balance * rate;
        const principal = emi - interest;
        balance -= principal;
      }

      // Stage 2 — apply lump sum to remaining balance
      const principalAfterPrepayment = Math.max(0, balance - smartLumpSumPrepayment);

      // Stage 3 — recalculate remaining tenure with same EMI on reduced principal
      // If prepayment wipes out the balance entirely, remaining months = 0
      let remainingMonthsAfterPrepayment = 0;
      if (principalAfterPrepayment > 0) {
        const numerator = Math.log(emi / (emi - principalAfterPrepayment * rate));
        const denominator = Math.log(1 + rate);
        remainingMonthsAfterPrepayment = Math.ceil(numerator / denominator);
      }

      revisedTenureMonths = monthsBeforePrepayment + remainingMonthsAfterPrepayment;
    }

    // Interest saved = original interest − interest on revised schedule
    const newInterest = Math.max(0, emi * revisedTenureMonths - smartLoanAmount);
    const interestSaved = Math.max(0, Math.round(totalInterest - newInterest));
    const monthsSaved = Math.max(0, months - revisedTenureMonths);

    setSmartResults({
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      emiToIncomeRatio: Math.round(ratio * 10) / 10,
      riskLevel: risk,
      originalTenureMonths: months,
      revisedTenureMonths: revisedTenureMonths,
      interestSaved: interestSaved,
      yearsSaved: monthsSaved,
      safeMonthlyEmi: Math.round(safeMonthlyEmi),
      maxAffordableLoan: Math.round(maxAffordableLoan),
      purchaseVerdict: verdict,
    });
  };

  // Run when Smart EMI inputs change
  useEffect(() => {
    calculateSmartEmi();
  }, [
    smartLoanAmount,
    smartPropertyPrice,
    smartDownPayment,
    smartInterestRate,
    smartTenure,
    smartIncome,
    smartExistingEmi,
    smartLumpSumPrepayment,
    smartPrepaymentAfterYears,
  ]);

  // Sync Rent vs Buy price and EMI from Smart EMI — keeps fields pre-filled but user can still edit them
  useEffect(() => {
    setRvbPrice(smartPropertyPrice);
  }, [smartPropertyPrice]);

  useEffect(() => {
    if (smartResults.monthlyEmi > 0) {
      setRvbEmi(smartResults.monthlyEmi);
    }
  }, [smartResults.monthlyEmi]);

  // Related properties: price within Property Price ± 5 Lakh
  const totalBudgetRupees = smartPropertyPrice;
  const totalBudgetLakhs = totalBudgetRupees / 1e5;
  const relatedProperties = useMemo(() => {
    if (totalBudgetRupees <= 0) return [];
    const marginLakhs = RELATED_PROPERTY_MARGIN_RUPEE / 1e5; // 5 lakhs
    const minL = Math.max(0, totalBudgetLakhs - marginLakhs);
    const maxL = totalBudgetLakhs + marginLakhs;
    return properties.filter((p): p is PropertyRow => {
      const valueInLakhs = getPriceInLakhs(p);
      if (valueInLakhs == null || Number.isNaN(valueInLakhs)) return false;
      return valueInLakhs >= minL && valueInLakhs <= maxL;
    });
  }, [properties, totalBudgetRupees, totalBudgetLakhs]);

  // Run when Rent vs Buy / Eligibility / Ownership inputs change
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

  // SEO meta description
  if (typeof document !== "undefined") {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Calculate EMI, loan eligibility, rent vs buy & ownership cost instantly. Smart real estate financial tools for Indian property buyers in 2026."
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://patronagerealtor.in${location === "/calculators" ? "/calculators/home-loan-emi-calculator" : location}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            Home Loan & Property Calculators for Smart Buyers in India (2026)
          </h1>
          <p className="text-xl text-muted-foreground">
            Tools to make smarter home buying decisions
          </p>
        </div>

        <Tabs
          value={activeTab}
          className="max-w-6xl mx-auto w-full"
          onValueChange={(value) => {
            if (value === "smart-emi") {
              setLocation("/calculators/home-loan-emi-calculator");
            } else if (value === "rent-vs-buy") {
              setLocation("/calculators/rent-vs-buy");
            } else if (value === "eligibility") {
              setLocation("/calculators/home-loan-eligibility");
            } else if (value === "ownership") {
              setLocation("/calculators/ownership-cost");
            }
          }}
        >
          <div
            id="calculators-tabs"
            role="button"
            tabIndex={0}
            className="flex justify-center mb-8 scroll-mt-24 cursor-pointer"
            onClick={() => document.getElementById("calculators-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("calculators-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
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

          {/* ============================================================
              TAB 1: SMART EMI PLANNER (UPDATED)
          ============================================================ */}
          <TabsContent value="smart-emi">
            <div className="grid lg:grid-cols-12 gap-6">

              {/* --- INPUT PANEL --- */}
              <Card className="lg:col-span-5 p-6 space-y-6 border-t-4 border-t-primary flex flex-col">
              <div className="space-y-4 flex-1 flex flex-col justify-between">

                  {/* 1 & 2. Property Price + Down Payment side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Price (₹)</Label>
                      <Input
                        type="text"
                        value={smartPropertyPrice === 0 ? "" : smartPropertyPrice.toLocaleString("en-IN")}
                        onChange={(e) => handlePropertyPriceChange(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Down Payment (₹)</Label>
                      <Input
                        type="text"
                        value={smartDownPayment === 0 ? "" : smartDownPayment.toLocaleString("en-IN")}
                        onChange={(e) => handleDownPaymentChange(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-2">
                    Down payment is upfront — loan amount is auto-calculated as Price − Down Payment
                  </p>

                  {/* 3. Loan Amount (auto-calculated, but editable) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Loan Amount (₹)</Label>
                      <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                        Auto = Price − Down Payment
                      </span>
                    </div>
                    <Input
                      type="text"
                      value={smartLoanAmount === 0 ? "" : smartLoanAmount.toLocaleString("en-IN")}
                      onChange={(e) => handleLoanAmountChange(e.target.value)}
                      className={smartLoanManuallyEdited ? "border-primary ring-1 ring-primary/30" : ""}
                    />
                    {smartLoanManuallyEdited && (
                      <p className="text-xs text-primary">
                        Manually overridden.{" "}
                        <button
                          type="button"
                          className="underline"
                          onClick={() => {
                            setSmartLoanManuallyEdited(false);
                            setSmartLoanAmount(Math.max(0, smartPropertyPrice - smartDownPayment));
                          }}
                        >
                          Reset to auto
                        </button>
                      </p>
                    )}
                  </div>

                  {/* 4 & 5. Interest Rate + Tenure */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest (%)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="e.g. 8.5"
                        value={smartInterestRate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d*$/.test(val)) {
                            setSmartInterestRate(val);
                          }
                        }}
                      />
                    </div>
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
                          <Select onValueChange={(val) => setSmartTenure(Number(val))}>
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

                  {/* 6. Net Monthly Income */}
                  <div className="space-y-2">
                    <Label>Net Monthly Income (₹)</Label>
                    <Input
                      type="text"
                      value={smartIncome === 0 ? "" : smartIncome.toLocaleString("en-IN")}
                      onChange={(e) => handleCurrencyInput(e.target.value, setSmartIncome)}
                    />
                  </div>

                  {/* 7. Lump Sum Prepayment + Prepayment After — side by side */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Lump Sum Prepayment (₹)</Label>
                        <Input
                          type="text"
                          value={smartLumpSumPrepayment === 0 ? "" : smartLumpSumPrepayment.toLocaleString("en-IN")}
                          onChange={(e) => handleCurrencyInput(e.target.value, setSmartLumpSumPrepayment)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prepayment After (Years)</Label>
                        <Select
                          value={smartPrepaymentAfterYears.toString()}
                          onValueChange={(val) => setSmartPrepaymentAfterYears(Number(val))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Immediately</SelectItem>
                            <SelectItem value="1">After 1 Year</SelectItem>
                            <SelectItem value="2">After 2 Years</SelectItem>
                            <SelectItem value="3">After 3 Years</SelectItem>
                            <SelectItem value="5">After 5 Years</SelectItem>
                            <SelectItem value="7">After 7 Years</SelectItem>
                            <SelectItem value="10">After 10 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      One-time payment that reduces principal — EMI stays the same, tenure shortens
                    </p>
                  </div>

                </div>
              </Card>

              {/* --- OUTPUT PANEL --- */}
              <div className="lg:col-span-7 grid md:grid-cols-2 gap-6 h-fit content-start">

                {/* Pie Chart: Principal vs Interest */}
                <Card className="p-6 flex flex-col justify-center items-center h-fit min-h-full">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Total Cost Breakdown
                  </h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                        <Pie
                          data={[
                            { name: "Principal", value: smartLoanAmount },
                            { name: "Interest", value: smartResults.totalInterest },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={82}
                          paddingAngle={2}
                          cornerRadius={8}
                          stroke="white"
                          strokeWidth={2}
                          dataKey="value"
                        >
                          <Cell fill={COLORS.chart[0]} />
                          <Cell fill={COLORS.chart[1]} />
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">Total Payable</p>
                    <p className="text-2xl font-bold">{formatCurrency(smartResults.totalPayment)}</p>
                  </div>
                </Card>

                {/* Stats: EMI + Risk */}
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

                    <p className="text-sm text-muted-foreground uppercase tracking-wider mt-4">
                      Risk Level
                    </p>
                    <div className="flex items-center gap-2 mt-1">
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

                  <div className="space-y-3 mt-6 pt-6 border-t border-dashed border-gray-300 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Safe Limit (40%)</span>
                      <span className="font-semibold">{formatCurrency(smartResults.safeMonthlyEmi)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Max Affordable Loan</span>
                      <span className="font-semibold">{formatCurrency(smartResults.maxAffordableLoan)}</span>
                    </div>
                  </div>
                </Card>

                {/* Prepayment Impact Card — full width, shown only when prepayment > 0 */}
                {smartLumpSumPrepayment > 0 && smartLumpSumPrepayment < smartLoanAmount && (
                  <Card className="md:col-span-2 p-6 border-t-4 border-t-green-500 bg-green-50/40 dark:bg-green-900/10">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Prepayment Impact
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Original Tenure
                        </p>
                        <p className="text-xl font-bold">
                          {formatTenure(smartResults.originalTenureMonths)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Prepayment After
                        </p>
                        <p className="text-xl font-bold">
                          {smartPrepaymentAfterYears === 0 ? "Immediately" : `${smartPrepaymentAfterYears} Yrs`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Revised Tenure
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTenure(smartResults.revisedTenureMonths)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Interest Saved
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(smartResults.interestSaved)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Time Saved
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTenure(smartResults.yearsSaved)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-green-200 dark:border-green-800">
  <p className="text-sm font-bold text-muted-foreground">
    {smartPrepaymentAfterYears === 0
      ? "Prepayment applied at start of loan"
      : `Prepayment applied after ${smartPrepaymentAfterYears} year${smartPrepaymentAfterYears > 1 ? "s" : ""} of EMI payments`}
  </p>
  <p className="text-sm font-bold text-muted-foreground text-right">
    EMI stays at {formatCurrency(smartResults.monthlyEmi)} — only tenure shortens
  </p>
</div>
                  </Card>
                )}

              </div>
            </div>

            {/* Related Properties */}
            {totalBudgetRupees > 0 && (
              <Card className="mt-8 border rounded-lg bg-card p-6 md:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Related Properties
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Properties within ₹5 Lakh of your property price ({formatCurrency(totalBudgetRupees)})
                  {totalBudgetLakhs > 0 && (
                    <span className="block mt-1">
                      Budget range: ₹{Math.max(0, totalBudgetLakhs - 5).toFixed(1)} – ₹{(totalBudgetLakhs + 5).toFixed(1)} Lakh
                    </span>
                  )}
                </p>
                {relatedProperties.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-6 text-center">
                    No properties in this budget range. Try adjusting the Property Price, or browse all properties.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedProperties.slice(0, 6).map((property) => (
                      <Card
                        key={property.id}
                        className="overflow-hidden group border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setDetailProperty(property);
                          setDetailOpen(true);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setDetailProperty(property);
                            setDetailOpen(true);
                          }
                        }}
                      >
                        <CardHeader className="p-0 relative">
                          <Badge className="absolute top-2 left-2 z-10 bg-background/90 text-foreground text-xs">
                            {property.status}
                          </Badge>
                          <div className="overflow-hidden h-44">
                            {property.images && property.images.length > 0 ? (
                              <SupabaseImage
                                src={property.images[0]}
                                alt={property.title}
                                transformWidth={400}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : property.image_url ? (
                              <SupabaseImage
                                src={property.image_url}
                                alt={property.title}
                                transformWidth={400}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <PlaceholderImage
                                height="h-full"
                                text="Property"
                                className="group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <h4 className="font-heading font-semibold text-base line-clamp-1">
                            {property.title}
                          </h4>
                          <p className="font-semibold text-primary text-sm mt-1">
                            {getDisplayPrice(property)}
                          </p>
                          {property.location && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="line-clamp-1">{property.location}</span>
                            </p>
                          )}
                          {property.bhk_type && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Home className="h-3 w-3 shrink-0" />
                              {property.bhk_type}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* How It Works + FAQs */}
            <Card className="mt-8 border rounded-lg bg-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                <BookOpen className="h-5 w-5 shrink-0" />
                <h3 className="text-lg">How Smart EMI Calculator Works</h3>
              </div>
              <div className="space-y-6 text-muted-foreground text-sm md:text-base leading-relaxed">
                <div>
                  <h4 className="font-bold text-foreground mb-2">What it calculates</h4>
                  <p>
                    Enter your property price and down payment — the loan amount is automatically calculated as the difference. You can also override the loan amount manually. The calculator shows your monthly EMI, total interest, total payment, and risk level. If you enter a lump sum prepayment, it shows how much your tenure shortens and how much interest you save — while keeping the EMI the same.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Why it matters</h4>
                  <p>
                    Buying a home is a long-term commitment. The Smart EMI calculator helps you see if you can afford the loan without stress, plan your budget, and understand the real impact of a one-time prepayment. Knowing your safe EMI limit helps you avoid overstretching and stay financially secure.
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="faq-1" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        What is the &quot;Safe EMI&quot; limit?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      A safe EMI is the amount you can pay without financial stress. Financial experts recommend that your total EMI should not exceed 40% of your monthly income. The calculator checks your EMI against this limit to keep you financially secure.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        What do the risk levels mean?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">The calculator assigns a risk level based on your EMI:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Safe</strong> – EMI is comfortably within limits</li>
                        <li><strong>Moderate</strong> – EMI is manageable but leaves less room for savings</li>
                        <li><strong>High Risk</strong> – EMI is too high and may cause financial stress</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        How does lump sum prepayment work?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">When you make a lump sum prepayment:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>The amount is applied directly to reduce your outstanding principal</li>
                        <li>Your monthly EMI stays exactly the same</li>
                        <li>The loan gets paid off sooner — your tenure shortens automatically</li>
                      </ul>
                      <p>This matches how banks like SBI handle prepayments. The calculator shows the revised tenure, interest saved, and total time saved.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-4" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">
                        Why should I use this calculator before buying a home?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">A home loan is a long-term commitment, often for 20–30 years. This calculator helps you:</p>
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

          {/* ============================================================
              TAB 2: RENT VS BUY (UNCHANGED)
          ============================================================ */}
          <TabsContent value="rent-vs-buy">
          <div className="grid lg:grid-cols-12 gap-6 lg:items-stretch">
          <Card className="lg:col-span-5 p-6 space-y-6 h-fit">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent (₹)</Label>
                    <Input
                      type="text"
                      value={rvbRent === 0 ? "" : rvbRent.toLocaleString("en-IN")}
                      onChange={(e) => handleCurrencyInput(e.target.value, setRvbRent)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Price (₹)</Label>
                    <Input
                      type="text"
                      value={rvbPrice === 0 ? "" : rvbPrice.toLocaleString("en-IN")}
                      onChange={(e) => handleCurrencyInput(e.target.value, setRvbPrice)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected EMI (₹)</Label>
                    <Input
                      type="text"
                      value={rvbEmi === 0 ? "" : rvbEmi.toLocaleString("en-IN")}
                      onChange={(e) => handleCurrencyInput(e.target.value, setRvbEmi)}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 bg-muted/20 p-2 md:p-3 rounded-lg text-center md:text-left">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Total Rent ({rvbHorizon}y)</p>
                    <p className="text-lg font-bold">{formatCurrency(rvbResults.totalRent)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Total EMI ({rvbHorizon}y)</p>
                    <p className="text-lg font-bold">{formatCurrency(rvbResults.totalEmi)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Break-even</p>
                    <p className="text-lg font-bold text-blue-600">
                      {rvbResults.breakEven > 0 ? `Year ${rvbResults.breakEven}` : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Asset Value</p>
                    <p className="text-lg font-bold">{formatCurrency(rvbResults.futureValue)}</p>
                  </div>
                </div>

                <div className="mb-6 text-center md:text-left">
                  <h3 className="text-xl font-bold">
                    Verdict:{" "}
                    <span className={rvbResults.result.includes("Buying") ? "text-green-600" : "text-blue-600"}>
                      {rvbResults.result}
                    </span>
                  </h3>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rvbResults.graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="year" tickLine={false} axisLine={false} />
                      <YAxis tickFormatter={(val) => `₹${val / 100000}L`} tickLine={false} axisLine={false} width={60} />
                      <Tooltip formatter={(val: number) => formatCurrency(val)} labelFormatter={(label) => `Year ${label}`} />
                      <Legend />
                      <Line type="monotone" dataKey="Rent" stroke={COLORS.chart[2]} strokeWidth={2} name="Cumulative Rent" dot={false} />
                      <Line type="monotone" dataKey="EMI" stroke={COLORS.chart[3]} strokeWidth={2} name="Cumulative EMI" dot={false} />
                      <Line type="monotone" dataKey="AssetValue" stroke={COLORS.chart[1]} strokeWidth={2} name="Property Value" dot={false} />
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
                    Deciding between renting and buying is one of the biggest financial choices you will make. This calculator gives you a clear, numbers-based view so you can see which option fits your situation better.
                  </p>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="rvb-faq-1" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">How does the calculator compare renting and buying?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      The calculator compares both options over the same time period. For renting, it calculates the total rent you would pay assuming rent increases every year. For buying, it calculates the total EMI paid and estimates the future value of the property.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="rvb-faq-2" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">What does Asset Value mean?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      Asset Value is the estimated value of the property at the end of your selected time period. The calculator assumes the property value increases every year, showing the long-term value you may build by owning a home.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="rvb-faq-3" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">Does this calculator mean buying is always better?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      No. The result depends on how long you plan to stay and your financial situation. For shorter stays, renting may make more sense. The calculator helps you decide based on numbers, not assumptions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="rvb-faq-4" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">Why does the calculator assume rent and property value increases?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      Rent generally increases over time due to inflation and demand. Property values also tend to grow in the long term. These assumptions help create a realistic comparison, though actual future values may vary.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>

          {/* ============================================================
              TAB 3: ELIGIBILITY (UNCHANGED)
          ============================================================ */}
          <TabsContent value="eligibility">
            <div className="grid lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Net Monthly Income (₹)</Label>
                    <Input
                      type="text"
                      value={eligIncome === 0 ? "" : eligIncome.toLocaleString("en-IN")}
                      onChange={(e) => handleCurrencyInput(e.target.value, setEligIncome)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current EMIs (₹)</Label>
                    <Input
                      type="text"
                      value={eligEmi === 0 ? "" : eligEmi.toLocaleString("en-IN")}
                      onChange={(e) => handleCurrencyInput(e.target.value, setEligEmi)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest (%)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="e.g. 8.5"
                        value={eligInterestRate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d*$/.test(val)) {
                            setEligInterestRate(val);
                          }
                        }}
                      />
                    </div>
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
                          <Select onValueChange={(val) => setEligTenure(Number(val))}>
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
                  <div className="h-full bg-primary" style={{ width: "50%" }}></div>
                </div>
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <span>Max Recommended EMI: {formatCurrency(eligResults.maxEmi)}</span>
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
                    Knowing your eligibility before you shop helps you set a realistic budget and talk to banks with confidence.
                  </p>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="elig-faq-1" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">How does the calculator decide my eligibility?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">The calculator first calculates your disposable income by subtracting your existing EMIs from your monthly income. From this:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-2">
                        <li>Forty percent is considered a safe monthly EMI limit</li>
                        <li>Fifty percent is considered the maximum EMI limit</li>
                      </ul>
                      <p>Using the safe EMI limit, the calculator reverse-calculates the loan amount you can comfortably service.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="elig-faq-2" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">What is disposable income?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      Disposable income is the amount of money you have left each month after paying your existing EMIs. This is the income available for taking on a new home loan safely.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="elig-faq-3" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">What is the Max EMI?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      The Max EMI is fifty percent of your disposable income. This represents the upper limit of what banks may allow, but it is considered a stretch and may reduce your financial flexibility.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="elig-faq-4" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">Why should I check eligibility before buying a home?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">Checking eligibility early helps you:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Set a realistic property budget</li>
                        <li>Avoid loan rejections later</li>
                        <li>Negotiate confidently with banks</li>
                        <li>Prevent financial overcommitment</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="elig-faq-5" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">Is this calculator the same as what banks use?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      The calculator follows the same core principles used by banks. Actual bank approvals may vary slightly based on credit score, employment type, and other factors, but this calculator provides a reliable estimate.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>

          {/* ============================================================
              TAB 4: OWNERSHIP COST (UNCHANGED)
          ============================================================ */}
          <TabsContent value="ownership">
            <div className="grid lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 p-6 space-y-6">
                <div className="space-y-4">
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
                  <div className="space-y-2">
                    <Label>Base Property Price (₹)</Label>
                    <Input
                      type="text"
                      value={costPrice === 0 ? "" : costPrice.toLocaleString("en-IN")}
                      onChange={(e) => handleCurrencyInput(e.target.value, setCostPrice)}
                    />
                  </div>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cost per sq.ft (₹)</Label>
                      <Input
                        type="text"
                        value={costPerSqft === 0 ? "" : costPerSqft}
                        onChange={(e) => handleCurrencyInput(e.target.value, setCostPerSqft)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Area (sq.ft)</Label>
                      <Input
                        type="text"
                        value={costArea === 0 ? "" : costArea}
                        onChange={(e) => handleCurrencyInput(e.target.value, setCostArea)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of years (maintenance)</Label>
                    <Select
                      value={costMaintenanceYears.toString()}
                      onValueChange={(val) => setCostMaintenanceYears(Number(val))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <div className="space-y-2">
                    <Label>Registration Cost (₹)</Label>
                    <Input
                      type="text"
                      value={registrationCost === 0 ? "" : registrationCost}
                      onChange={(e) => handleCurrencyInput(e.target.value, setRegistrationCost)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Advocate Cost (₹)</Label>
                    <Input
                      type="text"
                      value={advocateCost === 0 ? "" : advocateCost}
                      onChange={(e) => handleCurrencyInput(e.target.value, setAdvocateCost)}
                    />
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-7 p-6 flex flex-col justify-center min-h-full">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Total Ownership Cost</p>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(costResults.total)}</p>
                  </div>
                  <div className="space-y-3 pt-6 border-t">
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Stamp Duty ({costGender === "female" ? "6%" : "7%"})</span>
                      <span className="font-semibold">{formatCurrency(costResults.stampDuty)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>GST ({costPropertyStatus === "under-construction" ? "5%" : "0%"})</span>
                      <span className="font-semibold">{formatCurrency(costResults.gst)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>TDS (1%)</span>
                      <span className="font-semibold">{formatCurrency(costResults.tds)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Maintenance ({costMaintenanceYears} {costMaintenanceYears === 1 ? "Year" : "Years"})</span>
                      <span className="font-semibold">{formatCurrency(costResults.maintenance)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Registration</span>
                      <span className="font-semibold">{formatCurrency(costResults.registration)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                      <span>Advocate</span>
                      <span className="font-semibold">{formatCurrency(costResults.advocate)}</span>
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
                    Enter the base property price, your gender (for stamp duty rate), property status, cost per sq.ft, area, number of years for maintenance, and any registration or advocate charges. The calculator adds stamp duty, GST (if under construction), TDS, maintenance, plus your optional charges to give you the total cost of ownership.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key components</h4>
                  <p>
                    <strong>Stamp duty</strong> – 7% for male buyers, 6% for female buyers. <strong>GST</strong> – 5% for under-construction, 0% for ready-to-move. <strong>TDS</strong> – 1% of property value. <strong>Maintenance</strong> – (Cost per sq.ft × Area) × 12 × selected years.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Why it matters</h4>
                  <p>
                    Buying a property involves more than the listed price. This calculator shows you the full amount you will need so you can budget accurately and avoid surprises at the time of purchase.
                  </p>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="own-faq-1" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">How is stamp duty calculated?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">Stamp duty is calculated based on the buyer&apos;s gender:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>For male buyers: seven percent of the base property price</li>
                        <li>For female buyers: six percent of the base property price</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="own-faq-2" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">What is TDS and how is it calculated?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      TDS stands for Tax Deducted at Source. It is calculated as one percent of the base property price and is applicable as per current tax rules when purchasing property above the specified value.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="own-faq-3" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">How is maintenance cost calculated?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      Monthly maintenance = cost per square foot × total area. This is then multiplied by twelve and by the number of years selected to get the total advance maintenance amount.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="own-faq-4" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">What are registration and advocate charges?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      These are additional costs involved in the legal transfer of the property. These amounts vary, so the calculator allows you to enter them manually if applicable.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="own-faq-5" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">Why should I use the Ownership Cost Calculator?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      <p className="mb-2">Many buyers focus only on the property price and underestimate additional costs. This calculator helps you:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Plan your finances accurately</li>
                        <li>Avoid last minute surprises</li>
                        <li>Understand the true cost of ownership</li>
                        <li>Make informed decisions before finalizing a property</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="own-faq-6" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
                    <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="text-left font-bold text-foreground pr-4">Is this calculator accurate for real life purchases?</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                      The calculator follows commonly used real world rules and government charges. Actual amounts may vary slightly depending on state laws, builder policies, and individual agreements, but the calculator provides a reliable and practical estimate.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* SEO Content Block */}
        <Card className="mt-8 border rounded-lg bg-card shadow p-6 md:p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Complete Real Estate Financial Calculator Suite – India 2026
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
            <p>
              Buying property in India is one of the biggest financial decisions you will ever make. Whether you are a first-time homebuyer or a seasoned real estate investor, understanding your numbers before committing is critical.
            </p>
            <p>
              Our <strong>Home Loan & Property Calculator Suite (2026 edition)</strong> helps you make confident, data-driven decisions using four powerful tools:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Smart EMI Calculator</li>
              <li>Loan Eligibility Calculator</li>
              <li>Rent vs Buy Calculator</li>
              <li>Ownership Cost Calculator</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-8">Smart EMI Calculator – Plan Your Loan Intelligently</h3>
            <p>
              Enter your property price and down payment — the loan amount is automatically calculated. The Smart EMI Calculator shows your monthly EMI, total interest, EMI-to-income ratio, and risk level. Enter a lump sum prepayment to see revised tenure, interest saved, and time saved — exactly how banks like SBI process prepayments.
            </p>
            <p className="font-mono bg-muted/20 p-3 rounded-md text-sm">
              EMI = [P × R × (1 + R)^N] / [(1 + R)^N – 1]
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-8">Loan Eligibility Calculator – Know Your Borrowing Power</h3>
            <p>
              Estimates how much home loan you can safely take based on income, existing EMIs, interest rate, and tenure. Uses 40% of disposable income as the safe EMI limit.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-8">Rent vs Buy Calculator – Make the Right Decision</h3>
            <p>
              Compares total rent paid, total EMI paid, projected property appreciation, and break-even year over your selected time horizon. Rent assumed to increase at 10% annually; property value at 7%.
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-8">Ownership Cost Calculator – Know the True Cost</h3>
            <p>
              Includes stamp duty (6% or 7%), GST (5% for under-construction), TDS (1%), maintenance, registration, and advocate charges — giving you the full picture beyond the listing price.
            </p>
          </div>
        </Card>

        {/* SEO FAQ Block */}
        <Card className="mt-8 border rounded-lg bg-card shadow p-6 md:p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Frequently Asked Questions – Home Loan & Property Calculators (2026)
          </h2>
          <p className="text-muted-foreground mb-6">
            Here are answers to common questions property buyers and investors in India have when using our financial planning calculators.
          </p>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="seo-faq-1" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
              <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <span className="text-left font-bold text-foreground pr-4">How accurate is this home loan calculator for India in 2026?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                It uses the standard EMI formula used by Indian banks. While final approval depends on credit score and lender policy, results provide a reliable financial estimate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="seo-faq-2" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
              <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <span className="text-left font-bold text-foreground pr-4">What is a safe EMI-to-income ratio?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                Financial experts recommend keeping total EMIs below 40% of monthly income for financial stability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="seo-faq-3" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
              <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <span className="text-left font-bold text-foreground pr-4">Does the Rent vs Buy calculator consider property appreciation?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                Yes. It assumes annual property growth to estimate future asset value for long-term comparison.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="seo-faq-4" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
              <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <span className="text-left font-bold text-foreground pr-4">Is GST applicable on ready-to-move properties?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                No. GST is typically applicable only on under-construction properties.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="seo-faq-5" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
              <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <span className="text-left font-bold text-foreground pr-4">Why should I calculate ownership cost before booking?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                Additional charges like stamp duty and TDS significantly increase total cost beyond the listed property price. Calculating ownership cost helps you budget accurately.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="seo-faq-6" className="border border-border rounded-lg px-4 bg-muted/5 hover:bg-muted/20 hover:border-primary/30 transition-colors duration-200 border-b-0 data-[state=open]:bg-muted/10 data-[state=open]:border-primary/20">
              <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <span className="text-left font-bold text-foreground pr-4">Can investors use these calculators?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 pt-0">
                Yes. Investors can evaluate leverage, ROI potential, and long-term asset growth before committing capital.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "How accurate is this home loan calculator for India in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "It uses the standard EMI formula used by Indian banks. While final approval depends on credit score and lender policy, results provide a reliable estimate." } },
                { "@type": "Question", "name": "What is a safe EMI-to-income ratio?", "acceptedAnswer": { "@type": "Answer", "text": "Financial experts recommend keeping total EMIs below 40% of monthly income for financial stability." } },
                { "@type": "Question", "name": "Does the Rent vs Buy calculator consider property appreciation?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, it estimates future property value growth to compare long-term renting versus buying." } },
                { "@type": "Question", "name": "Is GST applicable on ready-to-move properties?", "acceptedAnswer": { "@type": "Answer", "text": "No, GST is generally applicable only on under-construction properties." } },
                { "@type": "Question", "name": "Why should I calculate ownership cost before booking?", "acceptedAnswer": { "@type": "Answer", "text": "Because stamp duty, TDS, and other charges significantly increase the total cost beyond the property price." } },
                { "@type": "Question", "name": "Can investors use these calculators?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, investors can use these tools to evaluate affordability, leverage, and long-term return potential." } }
              ]
            })
          }}
        />
      </main>
      <Footer />
      <PropertyDetailDialog
        property={detailProperty}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailProperty(null);
        }}
        similarProperties={relatedProperties.filter((p) => p.id !== detailProperty?.id).slice(0, 4)}
        onSimilarPropertySelect={(property) => setDetailProperty(property as PropertyRow)}      />
    </div>
  );
}