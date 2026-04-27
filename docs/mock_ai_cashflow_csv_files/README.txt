Mock CSV files for AI Statements and Cash Flow Business Analysis

Source basis:
- Generated from the uploaded ASDA-IQ definition file.
- Separator: semicolon (;)
- Encoding: UTF-8 with BOM
- Primary file structure uses the German technical field names exactly as defined.

Files:
1. cash_bookings_mock_german_headers.csv
   - 150 regular transaction records.
   - Recommended default backend test file.

2. cash_bookings_mock_english_headers.csv
   - 80 regular transaction records.
   - Same structure, but using English field names from the dictionary.
   - Useful for frontend display, mapping, or parser validation.

3. cash_bookings_mock_edge_cases_german_headers.csv
   - 40 records with intentional edge cases:
     large refunds, zero amount, late bookings, tax checks, repeated receipt numbers.
   - Useful for anomaly detection and validation flows.

4. cash_bookings_mock_combined_german_headers.csv
   - 190 records combining regular and edge-case rows.
   - Useful for AI analysis demos.

Business assumptions:
- BETRAG is represented as integer minor units, e.g. cents, because the dictionary defines numeric length 8 with decimal 0.
- Positive BETRAG means cash/card inflow.
- Negative BETRAG means refund or expense outflow.
- DATUMZEIT_DATUM uses YYYYMMDD.
- DATUMZEIT_ZEIT uses HHMMSS.
- BUTYP mock mapping:
  1 = cash sale
  2 = card sale
  3 = refund
  4 = cash deposit / safe transfer
  5 = petty cash expense
- MWST, MWST1, MWST2 and MWST3 are mocked tax amounts.
- TXT is capped at 18 characters.
- KANAME is capped at 5 characters.
- TSE fields are synthetic placeholders for parser and flow testing, not real fiscal signatures.
