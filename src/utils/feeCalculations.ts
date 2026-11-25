import type { FeeAccount, FeeStatus, Installment, InstallmentStatus, Payment } from "@/types";
import { todayISO } from "@/utils/formatters";

/**
 * Recomputes installment allocations, totalPaid, outstandingBalance,
 * nextDueDate, and status for a fee account strictly from its payments.
 */
export function recalculateFeeState(
  account: FeeAccount,
  accountInstallments: Installment[],
  accountPayments: Payment[],
  referenceDate = todayISO()
): { account: FeeAccount; installments: Installment[] } {
  const totalPaid = Math.min(
    account.totalFees,
    accountPayments.reduce((sum, p) => sum + Math.max(0, p.amount), 0)
  );
  const outstandingBalance = Math.max(0, account.totalFees - totalPaid);

  const sortedInstallments = [...accountInstallments].sort(
    (a, b) => a.installmentNumber - b.installmentNumber
  );

  let remainingCredit = totalPaid;
  const updatedInstallments: Installment[] = sortedInstallments.map((inst) => {
    const applied = Math.min(inst.amountDue, Math.max(0, remainingCredit));
    remainingCredit = Math.max(0, remainingCredit - applied);

    let instStatus: InstallmentStatus;
    if (applied >= inst.amountDue) {
      instStatus = "Paid";
    } else if (inst.dueDate < referenceDate) {
      instStatus = "Overdue";
    } else if (applied > 0) {
      instStatus = "Partial";
    } else {
      instStatus = "Pending";
    }

    return {
      ...inst,
      amountPaid: applied,
      status: instStatus,
    };
  });

  const unpaidInstallments = updatedInstallments.filter((i) => i.amountPaid < i.amountDue);
  const hasOverdue = unpaidInstallments.some((i) => i.dueDate < referenceDate);
  const nextDueDate = unpaidInstallments[0]?.dueDate;

  let status: FeeStatus;
  if (outstandingBalance === 0) {
    status = "Fully Paid";
  } else if (hasOverdue) {
    status = "Overdue";
  } else if (totalPaid > 0) {
    status = "Partially Paid";
  } else {
    status = "Unpaid";
  }

  return {
    account: {
      ...account,
      totalPaid,
      outstandingBalance,
      nextDueDate,
      status,
      updatedAt: new Date().toISOString(),
    },
    installments: updatedInstallments,
  };
}

/**
 * Builds an evenly split 2- or 3-part installment schedule summing exactly to totalFees.
 */
export function buildInstallmentSchedule(
  feeAccountId: string,
  studentId: string,
  totalFees: number,
  admissionDateISO: string,
  count = 3
): Installment[] {
  const parts = totalFees < 3000 ? 2 : count;
  const baseAmount = Math.floor(totalFees / parts / 100) * 100;
  const baseDate = new Date(`${admissionDateISO}T00:00:00`);
  const installments: Installment[] = [];

  let allocated = 0;
  for (let i = 0; i < parts; i++) {
    const isLast = i === parts - 1;
    const amountDue = isLast ? totalFees - allocated : baseAmount;
    allocated += amountDue;

    const due = new Date(baseDate);
    due.setMonth(due.getMonth() + i);
    const dueDate = due.toISOString().slice(0, 10);

    installments.push({
      id: `INST-${feeAccountId}-${i + 1}`,
      feeAccountId,
      studentId,
      installmentNumber: i + 1,
      dueDate,
      amountDue,
      amountPaid: 0,
      status: "Pending",
    });
  }

  return installments;
}
