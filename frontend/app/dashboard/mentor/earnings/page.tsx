"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpRight,
  IndianRupee,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type EarningsPoint = {
  month: string;
  amount: number;
};

type Transaction = {
  id: string;
  date: string;
  student: string;
  service: string;
  amount: string;
  status: "Paid" | "Pending";
};

const earningsData: EarningsPoint[] = [
  { month: "Jul", amount: 32000 },
  { month: "Aug", amount: 41000 },
  { month: "Sep", amount: 38000 },
  { month: "Oct", amount: 45000 },
  { month: "Nov", amount: 52000 },
  { month: "Dec", amount: 48500 },
];

const transactions: Transaction[] = [
  {
    id: "TXN-9823",
    date: "12 Dec 2025",
    student: "Aditi Sharma",
    service: "Mock Interview (60 min)",
    amount: "₹3,200",
    status: "Paid",
  },
  {
    id: "TXN-9822",
    date: "11 Dec 2025",
    student: "Rohan Mehta",
    service: "1:1 Mentorship (45 min)",
    amount: "₹2,600",
    status: "Paid",
  },
  {
    id: "TXN-9819",
    date: "10 Dec 2025",
    student: "Sara Khan",
    service: "Resume Review + Strategy",
    amount: "₹1,800",
    status: "Pending",
  },
];

const MentorEarningsPage: React.FC = () => {
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const handleExportCsv = () => {
    const header = ["Date", "Student", "Service", "Amount", "Status"];
    const rows = transactions.map((t) => [
      t.date,
      t.student,
      t.service,
      t.amount,
      t.status,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentor-earnings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-8 dark:bg-zinc-950/60 lg:p-10">
      <header className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Earnings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Monitor your payouts, track monthly trends, and download invoices.
          </p>
        </div>
        <Button
          className="gap-2 rounded-full bg-zinc-900 px-4 text-sm text-zinc-50 shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          type="button"
          onClick={handleExportCsv}
        >
          <ArrowDownToLine className="h-4 w-4" />
          Export CSV
        </Button>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        {/* Chart + stats */}
        <Card className="lg:col-span-2 rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Earnings (last 6 months)</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                <ArrowUpRight className="h-3 w-3" />
                +24% growth
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Mock chart component — replace with your preferred chart library
              later.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="mt-2 flex h-52 items-end gap-3 rounded-xl bg-zinc-50 px-4 pb-4 pt-3 dark:bg-zinc-900">
              {earningsData.map((point, index) => {
                const max = Math.max(...earningsData.map((p) => p.amount));
                const height = (point.amount / max) * 100;
                return (
                  <motion.div
                    key={point.month}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: `${height}%` }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="flex flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div className="relative flex w-full items-end justify-center rounded-full bg-zinc-200/60 dark:bg-zinc-800">
                      <div className="w-3/4 rounded-full bg-zinc-900 shadow-sm dark:bg-zinc-50" style={{ height: "100%" }} />
                    </div>
                    <span className="mt-1 text-[11px] text-zinc-500">
                      {point.month}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="space-y-3">
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Pending payout
                </p>
                <Badge variant="outline" className="text-[10px]">
                  Next cycle
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  7,200
                </p>
              </div>
              <p className="text-[11px] text-zinc-500">
                Will be processed to your payout method in the next cycle.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Total paid out
              </p>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  2,18,400
                </p>
              </div>
              <p className="text-[11px] text-zinc-500">
                Across 126 completed sessions.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Avg hourly rate
              </p>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  3,400
                </p>
              </div>
              <p className="text-[11px] text-zinc-500">
                Weighted average across sessions and services.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transactions table */}
      <Card className="mx-auto max-w-6xl rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Payment history</CardTitle>
              <CardDescription className="text-xs">
                Detailed view of all session payouts and invoices.
              </CardDescription>
            </div>
            <div className="hidden gap-2 md:flex">
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="h-7 rounded-full px-3 text-[11px]"
              >
                This month
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="h-7 rounded-full px-3 text-[11px]"
              >
                Last 90 days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-zinc-200 text-[11px] uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
              <tr>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Student</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {transactions.map((txn) => (
                <tr key={txn.id} className="align-middle">
                  <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-200">
                    {txn.date}
                  </td>
                  <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-200">
                    {txn.student}
                  </td>
                  <td className="py-2 pr-4 text-zinc-500 dark:text-zinc-400">
                    {txn.service}
                  </td>
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">
                    {txn.amount}
                  </td>
                  <td className="py-2 pr-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        txn.status === "Paid"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                          : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
                      }`}
                    >
                      {txn.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-[11px]"
                      type="button"
                      onClick={() => setInvoiceModalOpen(true)}
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                      Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Invoice modal - coming soon */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invoices coming soon</DialogTitle>
            <DialogDescription>
              You&apos;ll soon be able to download branded PDF invoices for each
              completed payout directly from this page. For now, please contact
              the Aureeture team if you need a detailed statement.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorEarningsPage;


