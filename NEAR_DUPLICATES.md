# Near-duplicate review status

As of the 2026-08-19 release pass, the audit compares only canonical sibling pages for the same brand and appliance. This targets pages that can plausibly compete for the same search intent while avoiding false alarms from similar mechanical faults across different brands.

Current result:

```text
same-brand/appliance canonical near-duplicate pairs above threshold: 0
```

Equivalent manufacturer-documented code groups were consolidated instead of paraphrased apart:

- GE Dehumidifier E01 / P1
- GE Range / Oven F0 / F1 / F6 / F7
- GE Range / Oven F3 / F4
- GE Range / Oven F8 / FF

Alias records remain in the data for search coverage and permanent redirects, but do not receive separate indexable pages or sitemap entries.
