# AI Opportunity & ROI Assessment

AI Opportunity & ROI Assessment for SMBs: identify practical AI use cases, estimate potential business value, assess feasibility and risk, and prioritize AI initiatives worth piloting.

> **Where should we use AI, and is it worth it?**

This is a **business-value decision-support tool**, not a generic AI readiness assessment or vendor recommendation engine.

## Philosophy

- **AI is not assumed to be the answer**: "Improve process first" and "AI not recommended" are valid outcomes
- **Deterministic scoring**: ROI, feasibility, risk, and rankings use transparent rules, not an LLM
- **Ranges, not point estimates**: all financial figures are scenario-based with stated assumptions
- **Governance caps**: high ROI cannot override high governance risk
- **Evidence-informed**: efficiency assumptions include source, date, and confidence level
- **Canadian SMB orientation**: CAD currency, Canadian business context, privacy awareness

## Architecture

```text
Questionnaire answers (Zustand + sessionStorage)
  → Normalized AssessmentProfile (Zod validated)
  → Pain-point → opportunity matching
  → Per-opportunity: value / cost / ROI / feasibility / governance
  → Composite scoring with governance caps
  → Portfolio ranking + recommendation categories
  → Matrices + roadmap + pilot plans + explainability
```

### Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Logic:** TypeScript deterministic scoring engine (`src/engine/`)
- **Data:** Structured opportunity library (`src/data/opportunities/`)
- **State:** Zustand + sessionStorage (no registration required)

### Key directories

| Path | Purpose |
|------|---------|
| `src/engine/` | Matching, value, ROI, feasibility, governance, recommendations |
| `src/data/opportunities/` | Expandable opportunity library |
| `src/data/assumptions/` | Efficiency ranges, cost bands, enum conversions |
| `src/data/scenarios/` | Demo businesses + golden test fixtures |
| `src/lib/schemas.ts` | Zod schemas for profiles and results |

## Scoring methodology

### Value calculation

```text
Annual time value =
  hours per occurrence × annual frequency × employees × hourly cost × efficiency range
```

Efficiency ranges are illustrative assumptions with source and confidence labels, not guaranteed savings.

### Composite score weights

| Dimension | Weight |
|-----------|--------|
| Business Value | 30% |
| ROI Potential | 25% |
| Feasibility | 20% |
| Implementation Cost | 10% |
| Governance Risk | 10% |
| Strategic Fit | 5% |

### Recommendation categories

| Category | When |
|----------|------|
| Priority Opportunity | High composite + feasible + manageable risk |
| Pilot Recommended | Good value but uncertainty needs testing |
| Improve Process First | Inconsistent process or poor data quality |
| Further Assessment Required | High governance risk or significant unknowns |
| Not Recommended | Low value, poor feasibility, or excessive risk |

### Governance cap rule

If governance risk is **High** or **Very High**, an opportunity cannot receive "Priority Opportunity" regardless of ROI. Very high risk opportunities require further assessment.

## ROI disclaimer

**All ROI and value figures are scenario-based estimates under stated assumptions.** They are not financial forecasts, guaranteed savings, or employment predictions. The tool focuses on task time, capacity, process efficiency, and cost opportunity, not workforce reduction.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # golden scenario tests
npm run build    # production build
```

### Demo scenarios

Load from the assessment page:

1. **Small Professional Services Firm**: email, documents, reporting
2. **HVAC Company**: scheduling, customer calls, job costing
3. **Marketing Agency**: content, research, reporting
4. **Healthcare Clinic**: scheduling, admin (elevated privacy considerations)

## Relationship to other BRUKD tools

| Tool | Question |
|------|----------|
| **AI Opportunity & ROI Assessment** (this) | Where should we use AI, and is it worth it? |
| **AI Vendor Selection Advisor** | Which AI solution should we choose? |
| **AI Governance Readiness Assessment** | Are we ready to govern AI? |

Recommended sequence: **Identify opportunity → Evaluate value → Choose solution → Assess governance → Implement responsibly**

## License

Private, BRUKD Consultancy portfolio project.
