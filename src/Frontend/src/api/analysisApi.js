const MOCK_DELAY = 3000;

const MOCK_RESULTS = {
  invoice_sequence: `## Non-Continuous Invoice Numbers

**Analysis Date:** ${new Date().toLocaleDateString()}

---

### Detected Gaps

- **Gap #1 — Invoices 10042–10051:** 9 consecutive invoice numbers are missing between March 3 and March 7. This range accounts for ~$87,400 in estimated missing revenue.
- **Gap #2 — Invoice 10198:** Single missing invoice on April 14. No corresponding credit note found.
- **Gap #3 — Invoices 10310–10314:** 5 invoices missing in a cluster on May 2. Pattern is consistent with batch deletion.

---

### Summary

| Metric | Value |
|---|---|
| Total invoices scanned | 1,284 |
| Missing invoice numbers | 15 |
| Estimated exposure | ~$142,600 |

---

### Recommendations

1. Request issuing department to account for all missing invoice ranges.
2. Cross-reference with payment records to identify unrecorded transactions.
3. Investigate May 2 cluster — batch deletions require authorization audit.
`,

  time_anomalies: `## Anomalies Over Time

**Analysis Date:** ${new Date().toLocaleDateString()}

---

### Temporal Patterns Detected

- **March spike:** Transaction volume rose 280% in the second week of March with no corresponding sales event or promotion on record.
- **Q2 revenue drop:** A sustained 40% decrease in revenue from April 15 to May 30 contradicts market trend data for the same period.
- **End-of-month clustering:** 62% of high-value invoices (>$5,000) are issued on the last business day of each month, suggesting possible earnings manipulation.

---

### Month-over-Month Deviation

- January → February: +12% (within expected range)
- February → March: **+280%** (anomalous)
- March → April: **-67%** (anomalous)
- April → May: -8% (within expected range)

---

### Recommendations

1. Correlate March spike with procurement or sales records.
2. Investigate end-of-month invoice clustering — this is a known red flag for window dressing.
3. Request narrative explanation for Q2 sustained drop.
`,

  outside_hours: `## Anomalies Outside Opening Times, Weekends & Holidays

**Analysis Date:** ${new Date().toLocaleDateString()}

---

### Out-of-Hours Transactions

- **23 transactions recorded between 22:00–05:00** on weekdays. Total value: $318,750.
- **11 transactions on Saturdays and Sundays**, none of which correspond to a known 24/7 operation period.
- **4 transactions on public holidays** (Jan 1, Apr 18, May 1, Nov 15), totaling $92,200.

---

### High-Risk Events

| Date | Time | Amount | Type |
|---|---|---|---|
| 2024-01-01 | 02:14 | $48,000 | Payment out |
| 2024-03-09 | 23:47 | $75,500 | Invoice issued |
| 2024-04-18 | 01:03 | $31,200 | Payment out |
| 2024-05-04 | 03:22 | $61,000 | Invoice issued |

---

### Recommendations

1. Flag all out-of-hours transactions for manual review by a compliance officer.
2. Confirm whether any authorized overnight batch processing covers these entries.
3. Holiday transactions with no system-automation origin require employee identification.
`,

  hash_signatures: `## Hash Code Signature Anomalies — Vendor vs. Government Records

**Analysis Date:** ${new Date().toLocaleDateString()}

---

### Mismatched Records

- **14 invoices** have hash signatures that do not match the corresponding government tax authority records.
- **3 invoices** from Vendor #0047 (TechSupply Ltda.) carry forged digital signatures — the hash presented differs from the one registered at issuance.
- **2 invoices** from Vendor #0091 show valid hashes that belong to different documents, indicating possible document substitution.

---

### Signature Integrity Summary

| Status | Count | % of Total |
|---|---|---|
| Valid & matched | 1,248 | 97.2% |
| Hash mismatch | 14 | 1.1% |
| Forged signature | 3 | 0.2% |
| Document substitution | 2 | 0.2% |
| Inconclusive | 17 | 1.3% |

---

### Recommendations

1. Immediately escalate Vendor #0047 findings to the legal and compliance team.
2. Suspend payments to Vendor #0091 pending a full audit of document chain of custody.
3. Re-validate all 17 inconclusive signatures against the government portal directly.
4. Enforce mandatory hash verification at the point of invoice ingestion going forward.
`,
};

export const ANALYSIS_TYPES = [
  {
    id: 'invoice_sequence',
    label: 'Non-continuous invoice numbers',
    description: 'Detects gaps and discontinuities in invoice number sequences.',
  },
  {
    id: 'time_anomalies',
    label: 'Anomalies over time',
    description: 'Identifies unusual patterns, spikes, and drops across time periods.',
  },
  {
    id: 'outside_hours',
    label: 'Outside opening times, weekends & holidays',
    description: 'Flags transactions recorded outside of expected business hours.',
  },
  {
    id: 'hash_signatures',
    label: 'Hash code signatures — vendor vs. government',
    description: 'Cross-checks document hash signatures against government records.',
  },
];

export async function uploadAndAnalyze(files, selectedTypes) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const sections = selectedTypes
    .map((id) => MOCK_RESULTS[id])
    .filter(Boolean)
    .join('\n\n---\n\n');

  return { result: sections };
}
