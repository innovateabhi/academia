import React, { useState } from "react";
import { useAcademyStore } from "@/store/useAcademyStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Search,
  CheckCircle2,
  Printer,
  Download,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { formatIndianCurrency, formatIndianDate } from "@/utils/formatters";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CSCTransaction, CSCTransactionItem, PaymentMethod } from "@/types";

export function CscBillingPage() {
  const cscServices = useAcademyStore((s) => s.cscServices);
  const cscTransactions = useAcademyStore((s) => s.cscTransactions);
  const recordCSCTransaction = useAcademyStore((s) => s.recordCSCTransaction);
  const voidCSCTransaction = useAcademyStore((s) => s.voidCSCTransaction);

  // POS State
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CSCTransactionItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");

  // History & Preview
  const [activeTab, setActiveTab] = useState<"pos" | "history">("pos");
  const [previewTx, setPreviewTx] = useState<CSCTransaction | null>(null);

  const categories = [
    "All",
    "Documentation & Printing",
    "Citizen Applications",
    "Banking & Bills",
    "Identity Services",
  ];

  const filteredServices = cscServices.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch && s.isActive;
  });

  const handleAddToCart = (service: typeof cscServices[0]) => {
    const existing = cartItems.find((it) => it.serviceId === service.id);
    if (existing) {
      setCartItems(
        cartItems.map((it) =>
          it.serviceId === service.id
            ? { ...it, quantity: it.quantity + 1, total: (it.quantity + 1) * it.unitPrice }
            : it
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          serviceId: service.id,
          serviceName: service.name,
          category: service.category,
          unitPrice: service.unitPrice,
          quantity: 1,
          total: service.unitPrice,
        },
      ]);
    }
  };

  const handleUpdateQty = (serviceId: string, delta: number) => {
    setCartItems(
      cartItems
        .map((it) => {
          if (it.serviceId === serviceId) {
            const newQty = it.quantity + delta;
            return newQty > 0
              ? { ...it, quantity: newQty, total: newQty * it.unitPrice }
              : null;
          }
          return it;
        })
        .filter(Boolean) as CSCTransactionItem[]
    );
  };

  const handleRemoveItem = (serviceId: string) => {
    setCartItems(cartItems.filter((it) => it.serviceId !== serviceId));
  };

  const subtotal = cartItems.reduce((sum, it) => sum + it.total, 0);
  const netTotal = Math.max(0, subtotal - discountAmount);

  const handleCompleteBill = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty. Add services to complete bill.");
      return;
    }

    const tx = recordCSCTransaction({
      customerName,
      customerPhone,
      items: cartItems,
      discount: discountAmount,
      paymentMethod,
    });

    toast.success(`Completed Bill ${tx.receiptNumber} for ${formatIndianCurrency(netTotal)}`);
    setPreviewTx(tx);
    // Clear cart
    setCartItems([]);
    setCustomerName("");
    setCustomerPhone("");
    setDiscountAmount(0);
  };

  const handleVoidTx = (txId: string) => {
    const reason = window.prompt("Enter reason for voiding this CSC transaction:");
    if (reason && reason.trim()) {
      voidCSCTransaction(txId, reason.trim());
      toast.success("Transaction voided successfully");
    }
  };

  const handleDownloadPdfReceipt = (tx: CSCTransaction) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });

    // Header
    doc.setFillColor(11, 43, 91);
    doc.rect(0, 0, 148, 26, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(businessConfig.identity.name, 74, 10, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(245, 130, 32);
    doc.text("COMMON SERVICES CENTRE (CSC) — CASH RECEIPT", 74, 17, { align: "center" });

    // Meta details
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(8);
    doc.text(`Receipt No: ${tx.receiptNumber}`, 12, 34);
    doc.text(`Date & Time: ${formatIndianDate(tx.createdAt.slice(0, 10))}`, 12, 39);
    doc.text(`Payment Mode: ${tx.paymentMethod}`, 12, 44);

    doc.text(`Customer: ${tx.customerName || "Walk-in Citizen"}`, 85, 34);
    doc.text(`Mobile: ${tx.customerPhone || "N/A"}`, 85, 39);
    doc.text(`Operator: ${tx.staffName}`, 85, 44);

    const rows = tx.items.map((it, idx) => [
      String(idx + 1),
      it.serviceName,
      `Rs. ${it.unitPrice}`,
      String(it.quantity),
      `Rs. ${it.total}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["#", "Service Description", "Rate", "Qty", "Amount"]],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [11, 43, 91] },
      styles: { fontSize: 8 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 100;
    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal: Rs. ${tx.subtotal}`, 136, finalY + 8, { align: "right" });
    if (tx.discount > 0) {
      doc.text(`Discount: -Rs. ${tx.discount}`, 136, finalY + 13, { align: "right" });
    }
    doc.setFontSize(10);
    doc.setTextColor(11, 43, 91);
    doc.text(`Grand Total Paid: Rs. ${tx.totalAmount}`, 136, finalY + (tx.discount > 0 ? 19 : 15), { align: "right" });

    doc.setFontSize(7);
    doc.setTextColor(220, 38, 38);
    doc.text("DEMO DOCUMENT — NOT AN OFFICIAL GOVERNMENT TAX INVOICE", 74, 195, { align: "center" });

    doc.save(`${tx.receiptNumber}.pdf`);
    toast.success("CSC Receipt PDF downloaded");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2B5B] font-heading">
            CSC Digital Service Counter
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Fast POS billing for citizen services, document printing, lamination, and government form assistance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "pos" ? "orange" : "outline"}
            onClick={() => setActiveTab("pos")}
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Billing Terminal
          </Button>
          <Button
            size="sm"
            variant={activeTab === "history" ? "navy" : "outline"}
            onClick={() => setActiveTab("history")}
          >
            <Receipt className="w-4 h-4 mr-1.5" />
            Sales History ({cscTransactions.length})
          </Button>
        </div>
      </div>

      {activeTab === "pos" ? (
        /* TWO-PANEL POS WORKSPACE */
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: Service Catalogue (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle space-y-4">
            {/* Search & Categories */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search service name, photocopy, PAN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[#0B2B5B] text-white"
                      : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0754BD] transition-all flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#0754BD] mb-0.5">
                      {service.category}
                    </div>
                    <div className="font-bold text-xs text-[#111827] leading-tight mb-1">
                      {service.name}
                    </div>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 mb-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                    <span className="font-bold text-xs text-[#0B2B5B]">
                      {formatIndianCurrency(service.unitPrice)}{" "}
                      <span className="text-[9px] font-normal text-[#64748B]">/{service.unitType}</span>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(service)}
                      className="h-7 text-xs font-semibold hover:bg-[#0754BD] hover:text-white"
                    >
                      + Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL: Live Checkout Bill (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="font-bold text-sm text-[#0B2B5B] font-heading flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#F58220]" />
                  Active Citizen Bill
                </div>
                <Badge variant="blue" size="sm">
                  {cartItems.length} items
                </Badge>
              </div>

              {/* Customer Inputs (Optional) */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div>
                  <label className="block text-[#64748B] mb-1">Citizen Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sujit Das"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. 98300..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>

              {/* Cart List */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto mb-4 divide-y">
                {cartItems.length === 0 ? (
                  <div className="text-center py-10 text-xs text-[#64748B]">
                    No services selected. Click "+ Add" on the catalogue.
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.serviceId} className="pt-2 flex items-center justify-between text-xs">
                      <div className="pr-2 max-w-[180px]">
                        <div className="font-semibold text-[#111827] truncate">{item.serviceName}</div>
                        <div className="text-[10px] text-[#64748B]">
                          ₹{item.unitPrice} each
                        </div>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateQty(item.serviceId, -1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.serviceId, 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.serviceId)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-bold font-mono text-[#0B2B5B] w-14 text-right">
                        ₹{item.total}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Billing Totals & Checkout */}
            <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-[#111827]">₹{subtotal}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Discount (₹)</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-20 px-2 py-0.5 border rounded text-right text-xs"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Payment Mode</span>
                <div className="flex gap-2">
                  {(["Cash", "UPI", "Bank Transfer"] as PaymentMethod[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMethod(mode)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                        paymentMethod === mode
                          ? "bg-[#0754BD] text-white border-[#0754BD]"
                          : "bg-slate-50 text-[#64748B] border-slate-200"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-base font-extrabold text-[#0B2B5B] pt-2 border-t">
                <span>Total Payable:</span>
                <span className="text-lg text-[#0754BD] font-heading">
                  {formatIndianCurrency(netTotal)}
                </span>
              </div>

              <Button
                size="lg"
                variant="orange"
                onClick={handleCompleteBill}
                disabled={cartItems.length === 0}
                className="w-full font-bold justify-center"
              >
                Complete Bill &amp; Print Receipt
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* SALES HISTORY TAB */
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b text-[#64748B]">
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Services</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {cscTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#0B2B5B]">{tx.receiptNumber}</td>
                    <td className="p-3 text-[#64748B]">{formatIndianDate(tx.createdAt.slice(0, 10))}</td>
                    <td className="p-3 font-medium text-[#111827]">{tx.customerName || "Walk-in"}</td>
                    <td className="p-3 text-[#64748B] max-w-xs truncate">
                      {tx.items.map((i) => `${i.serviceName} (${i.quantity})`).join(", ")}
                    </td>
                    <td className="p-3 font-bold font-mono text-[#0754BD]">
                      {formatIndianCurrency(tx.totalAmount)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-medium">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant={tx.status === "Completed" ? "success" : "danger"} size="sm">
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPdfReceipt(tx)}
                        className="h-7 text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </Button>
                      {tx.status === "Completed" && (
                        <button
                          onClick={() => handleVoidTx(tx.id)}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Void
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
