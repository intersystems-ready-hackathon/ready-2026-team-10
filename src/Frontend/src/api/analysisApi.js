const MOCK_DELAY = 3000;

const MOCK_RESPONSE = `## Business Anomaly Report

**Analysis Date:** ${new Date().toLocaleDateString()}

---

### Cash Flow Anomalies

- **Irregular Revenue Spike (March):** Revenue jumped 340% in March with no corresponding increase in COGS, suggesting a potential one-time event or data entry error.
- **Negative Operating Cash Flow:** Operating cash flow turned negative in Q2 despite positive net income, indicating aggressive accrual accounting or deferred payments.
- **Accounts Receivable Surge:** A/R grew 58% while revenue grew only 12%, signaling potential collection issues or fictitious sales.

---

### Statement Irregularities

- **Inventory Discrepancy:** Inventory levels increased by $1.2M while cost of goods sold decreased, which is inconsistent with normal business operations.
- **Unusual SG&A Variation:** Selling, General & Administrative expenses fluctuate more than 200% between months with no seasonal pattern identified.
- **Missing Depreciation Entries:** Depreciation charges are absent from two months, suggesting incomplete records or accounting errors.

---

### Risk Indicators

- **High Leverage Ratio:** Debt-to-equity ratio exceeds 3.5x, significantly above industry average of 1.2x.
- **Working Capital Deficit:** Current liabilities exceed current assets by $450K, indicating short-term liquidity risk.

---

### Recommendations

1. Reconcile March revenue entry against source documents.
2. Investigate A/R aging report for overdue accounts.
3. Request complete depreciation schedule from accounting.
4. Consider immediate cash flow restructuring to address working capital deficit.
`;

export async function uploadAndAnalyze(files) {
  // Mock: simulate uploading and backend processing
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  return { result: MOCK_RESPONSE };
}
