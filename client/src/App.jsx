
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  CloudUpload,
  ChartNoAxesColumn,
  Users,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  CircleAlert,
  CheckCircle2,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Menu,
  X,
  Filter,
  Download,
  Sparkles,
  ReceiptText,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const initialTransactions = [
  {
    invoiceNumber: "INV008",
    vendorName: "Tech Solutions Pvt Ltd",
    amount: 500000,
    taxRate: 17,
    taxAmount: 100000,
    expectedTax: 85000,
    taxDifference: 15000,
    riskScore: 60,
    riskLevel: "HIGH",
    findings: [
      "Tax mismatch detected",
      "Invalid tax rate (17%)",
      "Unusual transaction amount",
    ],
  },
  {
    invoiceNumber: "INV007",
    vendorName: "Global Services Ltd",
    amount: 75000,
    taxRate: 18,
    taxAmount: 13500,
    expectedTax: 13500,
    taxDifference: 0,
    riskScore: 30,
    riskLevel: "MEDIUM",
    findings: ["Duplicate invoice detected"],
  },
  {
    invoiceNumber: "INV006",
    vendorName: "Apex Traders",
    amount: 1200000,
    taxRate: 28,
    taxAmount: 336000,
    expectedTax: 336000,
    taxDifference: 0,
    riskScore: 45,
    riskLevel: "MEDIUM",
    findings: ["Unusual transaction amount"],
  },
  {
    invoiceNumber: "INV005",
    vendorName: "Metro Supplies",
    amount: 45000,
    taxRate: 5,
    taxAmount: 2250,
    expectedTax: 2250,
    taxDifference: 0,
    riskScore: 15,
    riskLevel: "LOW",
    findings: [],
  },
  {
    invoiceNumber: "INV004",
    vendorName: "Skyline Enterprises",
    amount: 250000,
    taxRate: 18,
    taxAmount: 45000,
    expectedTax: 45000,
    taxDifference: 0,
    riskScore: 40,
    riskLevel: "MEDIUM",
    findings: ["Duplicate invoice detected"],
  },
  {
    invoiceNumber: "INV003",
    vendorName: "Vertex Solutions",
    amount: 95000,
    taxRate: 12,
    taxAmount: 11400,
    expectedTax: 11400,
    taxDifference: 0,
    riskScore: 0,
    riskLevel: "LOW",
    findings: [],
  },
  {
    invoiceNumber: "INV002",
    vendorName: "Prime Consulting",
    amount: 30000,
    taxRate: 18,
    taxAmount: 5400,
    expectedTax: 5400,
    taxDifference: 0,
    riskScore: 0,
    riskLevel: "LOW",
    findings: [],
  },
  {
    invoiceNumber: "INV001",
    vendorName: "ABC Enterprises",
    amount: 50000,
    taxRate: 18,
    taxAmount: 9000,
    expectedTax: 9000,
    taxDifference: 0,
    riskScore: 0,
    riskLevel: "LOW",
    findings: [],
  },
];

const riskColors = {
  LOW: "#21a66b",
  MEDIUM: "#f6b82e",
  HIGH: "#ff782c",
  CRITICAL: "#e72f36",
};

const riskDistribution = [
  { name: "Low Risk", value: 68, color: "#20a76c" },
  { name: "Medium Risk", value: 18.2, color: "#ffc332" },
  { name: "High Risk", value: 9.1, color: "#ff782c" },
  { name: "Critical Risk", value: 4.7, color: "#e62f36" },
];

const findingsData = [
  { name: "Tax Mismatch", count: 42, color: "#f05259" },
  { name: "Duplicate Invoice", count: 28, color: "#ff8738" },
  { name: "Unusual Amount", count: 24, color: "#ffbd38" },
  { name: "Invalid Tax Rate", count: 18, color: "#2878e7" },
  { name: "Missing Information", count: 12, color: "#8b6bea" },
];

const trendData = [
  { month: "Jan", total: 82, highRisk: 26 },
  { month: "Feb", total: 108, highRisk: 36 },
  { month: "Mar", total: 126, highRisk: 58 },
  { month: "Apr", total: 134, highRisk: 53 },
  { month: "May", total: 158, highRisk: 70 },
  { month: "Jun", total: 185, highRisk: 88 },
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Transactions", icon: FileText },
  { label: "Upload File", icon: CloudUpload },
  { label: "Analytics", icon: ChartNoAxesColumn },
  { label: "Vendors", icon: Users },
  { label: "Reports", icon: ReceiptText },
  { label: "Settings", icon: Settings },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function RiskBadge({ level }) {
  const styles = {
    LOW: "bg-emerald-50 text-emerald-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    HIGH: "bg-orange-50 text-red-600",
    CRITICAL: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${
        styles[level] || styles.LOW
      }`}
    >
      {level === "HIGH" || level === "CRITICAL"
        ? `${level === "HIGH" ? "High" : "Critical"} Risk`
        : `${level === "MEDIUM" ? "Medium" : "Low"} Risk`}
    </span>
  );
}

function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  tone,
  trend = "up",
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-rose-50 text-rose-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <article className="flex min-w-0 items-center gap-4 rounded-xl border border-white bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 ${tones[tone]}`}
      >
        <Icon size={25} strokeWidth={2.2} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-600 sm:text-sm">
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
          {value}
        </p>
        <p
          className={`mt-1 flex items-center gap-1 text-xs ${
            trend === "down" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {trend === "down" ? (
            <ArrowUpRight size={15} />
          ) : (
            <ArrowUpRight size={15} />
          )}
          <span className="font-semibold">{change}</span>
          <span className="hidden text-slate-500 sm:inline">
            {description}
          </span>
        </p>
      </div>
    </article>
  );
}

function Panel({ title, children, className = "", action }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("INV008");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const transactions = initialTransactions;

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return transactions;

    return transactions.filter((transaction) =>
      [
        transaction.invoiceNumber,
        transaction.vendorName,
        transaction.riskLevel,
      ].some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [search, transactions]);

  const selectedTransaction =
    transactions.find((transaction) => transaction.invoiceNumber === selectedId) ||
    transactions[0];

  const highRiskCount = transactions.filter(
    (transaction) =>
      transaction.riskLevel === "HIGH" ||
      transaction.riskLevel === "CRITICAL",
  ).length;

  const uniqueVendorCount = new Set(
    transactions.map((transaction) => transaction.vendorName),
  ).size;

  const visibleTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-gradient-to-b from-[#1d3b60] to-[#132c4a] text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[94px] items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center text-blue-300">
              <ShieldCheck size={42} strokeWidth={2.1} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TaxGuard-AI</h1>
              <p className="mt-0.5 text-[10px] leading-4 text-blue-100/75">
                AI-assisted Tax Compliance
                <br />& Financial Anomaly Detection
              </p>
            </div>
          </div>

          <button
            aria-label="Close navigation"
            className="rounded-lg p-1 text-white/80 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-6">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActivePage(label);
                setMobileSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium transition ${
                activePage === label
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                  : "text-blue-50/90 hover:bg-white/10"
              }`}
            >
              <Icon size={20} strokeWidth={2.1} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg bg-white/[0.07] p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-100">
              <Sparkles size={15} />
              AI insights
            </div>
            <p className="text-xs leading-5 text-blue-100/70">
              Rule-based compliance checks are active.
            </p>
          </div>
          <p className="mt-4 text-center text-[10px] text-blue-100/50">
            TAXGUARD-AI · PROTOTYPE
          </p>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-[220px]">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-7">
          <button
            aria-label="Open navigation"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="relative max-w-[590px] flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions, vendors, or invoice numbers..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            <button
              aria-label="Notifications"
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Bell size={21} />
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
            </button>

            <button className="flex items-center gap-2.5 rounded-lg py-1 pl-1 transition hover:bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <Users size={21} />
              </div>
              <span className="hidden text-sm font-semibold text-slate-800 sm:inline">
                Auditor
              </span>
              <ChevronDown
                size={16}
                className="hidden text-slate-500 sm:block"
              />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1800px] space-y-5 p-4 sm:p-6 lg:p-7">
          {/* Page heading */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-blue-600">{activePage}</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                {activePage === "Dashboard" ? "Dashboard Overview" : activePage}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor financial transactions and potential compliance risks.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
              <Activity size={15} className="text-emerald-600" />
              <span>Rule engine active</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <MetricCard
              title="Total Transactions"
              value={transactions.length.toLocaleString("en-IN")}
              change="Live prototype"
              description="sample records"
              icon={FileText}
              tone="blue"
            />
            <MetricCard
              title="High Risk Transactions"
              value={highRiskCount.toLocaleString("en-IN")}
              change="Requires review"
              description=""
              icon={CircleAlert}
              tone="red"
              trend="down"
            />
            <MetricCard
              title="Compliant Transactions"
              value={transactions.filter((t) => t.findings.length === 0).length}
              change="No findings"
              description="in current sample"
              icon={CheckCircle2}
              tone="green"
            />
            <MetricCard
              title="Unique Vendors"
              value={uniqueVendorCount}
              change="Sample vendors"
              description="in current data"
              icon={Users}
              tone="purple"
            />
          </div>

          {/* Analytics row */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Panel title="Risk Distribution">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative h-[190px] w-full max-w-[220px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={86}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {riskDistribution.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">
                      {transactions.length}
                    </span>
                    <span className="text-xs text-slate-500">Transactions</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  {riskDistribution.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="flex-1 text-slate-600">{item.name}</span>
                      <span className="font-semibold text-slate-800">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-[10px] text-slate-400">
                Illustrative distribution — not calculated from the sample rows.
              </p>
            </Panel>

            <Panel title="Findings Summary">
              <div className="space-y-4">
                {findingsData.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[minmax(105px,1fr)_minmax(65px,1.3fr)_24px] items-center gap-3"
                  >
                    <span className="truncate text-xs text-slate-600">
                      {item.name}
                    </span>
                    <div className="h-5 overflow-hidden rounded-sm bg-slate-100">
                      <div
                        className="h-full rounded-sm transition-all"
                        style={{
                          width: `${(item.count / 42) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-right text-xs font-medium text-slate-700">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[10px] text-slate-400">
                Illustrative counts — actual findings will come from the API.
              </p>
            </Panel>

            <Panel title="Transaction Trend">
              <div className="mb-4 flex justify-end gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  High Risk
                </span>
              </div>

              <div className="h-[190px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 2, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#edf1f6"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke="#3983e8"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#3983e8" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="highRisk"
                      name="High Risk"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#ef4444" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[10px] text-slate-400">
                Illustrative monthly trend.
              </p>
            </Panel>
          </div>

          {/* Transactions and analysis */}
          <div className="grid grid-cols-1 items-start gap-4 2xl:grid-cols-[minmax(0,2.15fr)_minmax(300px,0.85fr)]">
            <Panel
              title="Recent Transactions"
              action={
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Filter transactions"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    onClick={() => setSearch("")}
                  >
                    <Filter size={17} />
                  </button>
                  <button
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    onClick={() => setShowAll((current) => !current)}
                  >
                    {showAll ? "Show Less" : "View All"}
                  </button>
                </div>
              }
              className="overflow-hidden"
            >
              <div className="-mx-1 overflow-x-auto">
                <table className="w-full min-w-[790px] border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-semibold text-slate-600">
                      <th className="px-3 py-3">Invoice No.</th>
                      <th className="px-3 py-3">Vendor</th>
                      <th className="px-3 py-3">Amount (₹)</th>
                      <th className="px-3 py-3">Tax Rate</th>
                      <th className="px-3 py-3">Reported Tax (₹)</th>
                      <th className="px-3 py-3">Risk Score</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {visibleTransactions.map((transaction) => (
                      <tr
                        key={transaction.invoiceNumber}
                        className={`cursor-pointer text-xs transition hover:bg-blue-50/60 ${
                          selectedId === transaction.invoiceNumber
                            ? "bg-blue-50/40"
                            : "bg-white"
                        }`}
                        onClick={() => setSelectedId(transaction.invoiceNumber)}
                      >
                        <td className="px-3 py-3.5 font-medium text-slate-800">
                          {transaction.invoiceNumber}
                        </td>
                        <td className="max-w-[180px] truncate px-3 py-3.5 text-slate-600">
                          {transaction.vendorName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-slate-700">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-3 py-3.5">{transaction.taxRate}%</td>
                        <td className="whitespace-nowrap px-3 py-3.5">
                          {formatCurrency(transaction.taxAmount)}
                        </td>
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex min-w-10 justify-center rounded-md px-2 py-1.5 font-semibold ${
                              transaction.riskLevel === "HIGH" ||
                              transaction.riskLevel === "CRITICAL"
                                ? "bg-red-50 text-red-600"
                                : transaction.riskLevel === "MEDIUM"
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {transaction.riskScore}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <RiskBadge level={transaction.riskLevel} />
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <button
                            aria-label={`Analyze ${transaction.invoiceNumber}`}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-blue-100 hover:text-blue-700"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(transaction.invoiceNumber);
                            }}
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {visibleTransactions.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-12 text-center text-sm text-slate-500"
                        >
                          No transactions match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>
                  Showing {visibleTransactions.length} of{" "}
                  {filteredTransactions.length} sample transactions
                </span>
                <button
                  onClick={() => setSearch("")}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            </Panel>

            <Panel
              title="Transaction Analysis"
              action={
                <button
                  aria-label="More transaction options"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <MoreHorizontal size={20} />
                </button>
              }
            >
              <label
                htmlFor="transaction-select"
                className="mb-2 block text-xs font-medium text-slate-600"
              >
                Select a transaction
              </label>

              <div className="flex gap-2">
                <select
                  id="transaction-select"
                  value={selectedId}
                  onChange={(event) => setSelectedId(event.target.value)}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  {transactions.map((transaction) => (
                    <option
                      key={transaction.invoiceNumber}
                      value={transaction.invoiceNumber}
                    >
                      {transaction.invoiceNumber}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setSelectedId(selectedTransaction.invoiceNumber)}
                  className="rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Analyze
                </button>
              </div>

              <div
                className={`mt-4 rounded-lg border p-3.5 ${
                  selectedTransaction.riskScore >= 60
                    ? "border-red-100 bg-red-50/70"
                    : selectedTransaction.riskScore >= 30
                      ? "border-amber-100 bg-amber-50/60"
                      : "border-emerald-100 bg-emerald-50/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedTransaction.riskScore >= 60 ? (
                    <CircleAlert size={20} className="shrink-0 text-red-600" />
                  ) : (
                    <ShieldCheck
                      size={20}
                      className="shrink-0 text-emerald-600"
                    />
                  )}

                  <span className="flex-1 text-sm font-bold text-slate-800">
                    {selectedTransaction.riskLevel === "LOW"
                      ? "Lower Risk Transaction"
                      : `${selectedTransaction.riskLevel} Risk Transaction`}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Risk score</span>
                  <span className="font-bold text-slate-900">
                    {selectedTransaction.riskScore}/100
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${selectedTransaction.riskScore}%`,
                      backgroundColor:
                        riskColors[selectedTransaction.riskLevel],
                    }}
                  />
                </div>

                <h3 className="mb-2 mt-4 text-xs font-bold text-slate-800">
                  Findings
                </h3>

                {selectedTransaction.findings.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTransaction.findings.map((finding) => (
                      <li
                        key={finding}
                        className="flex items-start gap-2 text-xs leading-5 text-slate-700"
                      >
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs leading-5 text-slate-600">
                    No rule-based findings in this sample record.
                  </p>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Invoice amount</span>
                  <span className="font-semibold text-slate-800">
                    ₹ {formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Expected tax</span>
                  <span className="font-semibold text-slate-800">
                    ₹ {formatCurrency(selectedTransaction.expectedTax)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Reported tax</span>
                  <span className="font-semibold text-slate-800">
                    ₹ {formatCurrency(selectedTransaction.taxAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
                  <span className="font-medium text-slate-600">
                    Tax difference
                  </span>
                  <span
                    className={`font-bold ${
                      selectedTransaction.taxDifference !== 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    ₹ {formatCurrency(selectedTransaction.taxDifference)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/70 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
                  <Sparkles size={15} />
                  Auditor recommendation
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  {selectedTransaction.riskScore >= 60
                    ? "Review the findings and supporting invoice before deciding whether an issue is confirmed."
                    : selectedTransaction.riskScore >= 30
                      ? "Review the flagged indicators and verify the supporting transaction records."
                      : "No rule-based issue is currently flagged in this sample. Normal audit procedures still apply."}
                </p>
              </div>

              <p className="mt-4 text-[10px] leading-4 text-slate-400">
                Risk scores are screening indicators, not proof of fraud or
                legal non-compliance.
              </p>
            </Panel>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 py-4 text-[11px] text-slate-400">
            <span>TaxGuard-AI · Financial compliance workspace</span>
            <span>Prototype dashboard · Sample data</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
