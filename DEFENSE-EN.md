# Project Defense Outline & Committee Q&A (English)
> **Course:** AI-Based Programming  
> **Project Title:** UniPath 2.0 — Intelligent University Admission & Career Guidance Platform  
> **Host Institution:** Phu Xuan University (PXU)  
> **Team:** UP5 (Lead: Duong Dinh Phat, Lead Engineer: Tran Cong Quy)

---

## 1. Five-Sentence Project Introduction (Executive Summary)

1. **UniPath 2.0** is an intelligent web-based admissions advisory and online application ecosystem engineered with React 19, TypeScript, and Vite.
2. The platform bridges high school candidates, institutional admissions councils (specifically Phu Xuan University - PXU), and national education administrators across three strictly isolated role-based portals.
3. At its core, the platform combines standard Holland RIASEC psychometric profiling with a monotonic admissions matching engine that calculates realistic admission probabilities against specific major cutoffs and student budgets.
4. The system enforces an institutional Finite State Machine (FSM) that guarantees end-to-end data reconciliation, prevents duplicate submissions, and mandates auditable justifications for early admissions below standard cutoffs.
5. All client-server interfaces, CSV exports, and AI chatbot integrations are rigorously hardened against prompt injection, CSV formula injection, and unauthorized privilege escalation.

---

## 2. Top 10 Anticipated Committee Questions & Model Answers

### Q1: How does your AI Matching formula prevent unrealistic 100% admission predictions?
**Answer:**  
In earlier revisions, the system jumped to 100% when a student's score was merely 2.0 points above cutoff. We overhauled the calculation into a smooth, piecewise-linear probability curve (`src/services/MatchingService.ts`). The base percentage is capped at 94%, with an optional Holland psychometric compatibility bonus of +4%, guaranteeing a strict ceiling of 98%. This reflects real-world admissions realities where unforeseen quota fluctuations prevent absolute certainty.

### Q2: How do you prevent candidates from submitting duplicate applications or flooding the review queue?
**Answer:**  
We established a centralized submission validator (`validateNewApplicationSubmission` in `ApplicationWorkflow.ts`). It cross-checks candidate email, target university ID, and normalized major name against all active records. If an active application already exists, submission is rejected with code `DUPLICATE`. Furthermore, each student is strictly throttled to a maximum of 5 concurrent active applications (`MAX_ACTIVE_APPLICATIONS = 5`).

### Q3: What is your Finite State Machine (FSM) for application lifecycles, and how do you handle below-cutoff candidates?
**Answer:**  
Applications transition through discrete states: *Đang xét duyệt → Hồ sơ hợp lệ → Đã trúng tuyển*. Terminal states (*Đã trúng tuyển, Đã hủy, Đã bị hủy*) are immutable and cannot be revived. If an administrator attempts to approve a candidate whose score falls below the major cutoff, `validateReviewerStatusChange` mandates a verified justification note (minimum 8 characters, e.g., verified high school transcript OJT quota) before allowing state transition.

### Q4: How is Role-Based Access Control (RBAC) enforced, and why did you eliminate the client-side role switcher?
**Answer:**  
The legacy prototype allowed 1-click role switching for demo convenience, which violated security principles. We introduced salted SHA-256 password hashing (`src/utils/security.ts`) and segregated routes at the React root. The Demo Sandbox is gated by environment variable `VITE_ENABLE_DEMO_MODE` and restricted to authenticated Administrators at the Context layer, ensuring unauthenticated guests can never access institutional dashboards.

### Q5: How do you ensure the AI ChatBot does not hallucinate false cutoffs or tuition fees?
**Answer:**  
We implemented **Grounding** through a Supabase Edge Function (`supabase/functions/chat/index.ts`). Instead of allowing open-ended text generation, the server prompt injects the verified dataset of all 30 universities and explicitly instructs Gemini to respond strictly within those bounds. The output is constrained to a strict JSON Schema `{ "reply": string, "suggestedUniversities": string[] }` with temperature set to 0.3 for factual accuracy.

### Q6: What happens if the AI Edge Function encounters rate limits or network failures?
**Answer:**  
The Edge Function includes an exponential backoff retry mechanism (up to 2 retries on HTTP 429/5xx). On the frontend, `ChatBotModal.tsx` intercepts network errors or schema parsing mismatches and seamlessly transitions to a resilient offline keyword-matching fallback marked with an "offline mode" badge, preserving continuous user experience.

### Q7: Why did you choose React 19 and Vite 8 instead of a traditional full-stack framework like Next.js?
**Answer:**  
Our primary operational goal was sub-second client responsiveness and zero-latency desktop/mobile transitions for high school students on modest mobile connections. React 19's concurrent rendering paired with Vite's Rolldown-backed build pipeline delivers a production bundle under 135 KB gzipped, compiling in less than 900ms and deploying effortlessly to global edge networks like Vercel and Cloudflare Pages.

### Q8: How did you mitigate CSV Formula Injection when administrators export candidate data?
**Answer:**  
Exporting raw user-submitted names or codes into Excel creates OWASP CSV Injection vulnerabilities if strings begin with `=`, `+`, `-`, or `@`. In `src/utils/validation.ts`, function `sanitizeCsvCell` prepends a single apostrophe (`'`) to any dangerous leading character and encloses cells in RFC-4180 double quotes, neutralizing code execution in spreadsheet software.

### Q9: How do your unit tests verify business logic rather than mere UI appearance?
**Answer:**  
We built 20 automated Vitest unit tests in `src/__tests__/businessRules.test.ts` focusing entirely on headless business invariants: FSM transitions, duplicate detection, boundary scores (rejecting negative scores or >30.0), past-date scheduling rejection, Holland tie-breaking (eliminating 0-point categories from Top 3), and CSV sanitization. These run in 13ms in continuous integration.

### Q10: How does UniPath support web accessibility and Vietnamese user input standards?
**Answer:**  
Following `modern-web-guidance`, we eliminated premature chat submission during Vietnamese Telex/VNI IME composition by verifying `event.isComposing` and `keyCode === 229`. We also implemented W3C standard scrollbar properties, container queries, sticky table headers with keyboard navigation (`tabindex="0"`, `role="region"`), and clear `:focus-visible` outlines across all interactive controls.
