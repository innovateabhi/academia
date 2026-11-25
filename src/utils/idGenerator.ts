export function generateStudentId(existingIds: string[], year = new Date().getFullYear()): string {
  const prefix = `STU-${year}-`;
  let maxSeq = 0;
  for (const id of existingIds) {
    if (id.startsWith(prefix)) {
      const part = Number.parseInt(id.slice(prefix.length), 10);
      if (Number.isFinite(part) && part > maxSeq) {
        maxSeq = part;
      }
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
}

export function generateReceiptNumber(existingReceipts: string[], year = new Date().getFullYear()): string {
  const prefix = `RCPT-${year}-`;
  let maxSeq = 0;
  for (const r of existingReceipts) {
    if (r.startsWith(prefix)) {
      const part = Number.parseInt(r.slice(prefix.length), 10);
      if (Number.isFinite(part) && part > maxSeq) {
        maxSeq = part;
      }
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
}

export function generateEnquiryId(existingIds: string[], year = new Date().getFullYear()): string {
  const prefix = `ENQ-${year}-`;
  let maxSeq = 0;
  for (const id of existingIds) {
    if (id.startsWith(prefix)) {
      const part = Number.parseInt(id.slice(prefix.length), 10);
      if (Number.isFinite(part) && part > maxSeq) {
        maxSeq = part;
      }
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
}

export function generateEntityId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}
