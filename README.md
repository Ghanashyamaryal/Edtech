# ITpro Entrance

Nepal's leading IT entrance exam preparation platform for BIT, BCA, BSc CSIT, and BIM. Built with Next.js 15 and Supabase.

## Features

- **Multi-step Signup Stepper** — User Details → Auth OTP → Payment Info → Preview Form, with theme-colored progress indicator
- **Email OTP Verification** — 6-digit code via Supabase, replaces magic-link flow for both signup and password reset
- **Manual Payment Verification** — QR-based payment with WhatsApp CTA; admin reviews and approves
- **Pending-Verification Gate** — Middleware blocks access to dashboard until admin approves; clean "under verification" screen with WhatsApp follow-up
- **Courses** — Browse, enroll, and view curriculum
- **Study Notes** — Subject-grouped notes, formula sheets, downloadable materials
- **Live Classes & Recorded Lectures** — Zoom integration + on-demand library
- **Mock Tests & Exams** — Realistic simulations with question-level analytics
- **Admin Panel** — Manage courses, users, notes, exams; approve/reject pending signups
- **Bulk Question Add** — Multi-select, Select All, difficulty filter, "pick N random" for fast exam authoring
- **Role-based Access** — Student, Mentor, Admin (server-side enforced via middleware)
- **Email Notifications** — Welcome, signup, contact alerts via Resend

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4 (`@theme` block, not `tailwind.config`)
- **Database & Auth** — Supabase (SSR with `@supabase/ssr`)
- **UI Components** — Radix UI primitives + CVA for variants
- **Forms** — React Hook Form + Zod (with `mode: 'onTouched'` for blur-time validation)
- **Animations** — Framer Motion
- **Email (transactional)** — Resend with custom HTML templates
- **Icons** — Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Apply database migration (see "Database Setup" below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npx tsc --noEmit` — Type-check without emitting

## Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (landing)/                    # Public landing pages
│   │   ├── courses/
│   │   ├── notes/
│   │   │   └── subject/[id]/         # Per-subject notes view
│   │   ├── online-classes/
│   │   ├── mock-tests/
│   │   ├── contact/
│   │   └── ...
│   ├── auth/
│   │   ├── signup/                   # Renders SignupStepper
│   │   ├── login/
│   │   ├── forgot-password/          # 3-stage OTP flow
│   │   ├── reset-password/           # Legacy link-based fallback
│   │   └── callback/
│   ├── dashboard/                    # Student/mentor dashboard
│   ├── admin/                        # Admin panel
│   ├── pending-verification/         # Shown when is_verified=false
│   └── profile/
├── actions/                          # Server actions (Supabase)
│   ├── courses.ts
│   ├── exams.ts                      # Includes addQuestionsToExam (bulk)
│   ├── users.ts                      # saveSignupRequest, deleteUserAccount
│   ├── notes.ts
│   └── ...
├── components/
│   ├── atoms/                        # Button, Input, Stepper, Typography
│   │   └── rhf-components/           # RHFInput, RHFSelect, RHFCheckbox, RHFTextarea
│   ├── molecules/
│   ├── organisms/
│   │   ├── auth/
│   │   │   └── signup-stepper/       # 4-step signup flow
│   │   ├── landing/                  # LandingHeader, LandingFooter
│   │   └── dashboard/
│   └── ui/                           # Re-export shim
├── context/                          # Auth context
├── lib/
│   ├── supabase/                     # Browser, server, middleware clients
│   └── email.ts                      # Resend + HTML templates
├── utils/
│   └── validation.ts                 # Zod schemas (shared rules)
└── types/
```

## Database Setup

After provisioning Supabase, run the included migration to add the columns the signup flow depends on:

```sql
-- migrations/2026_05_02_add_requested_course_to_users.sql
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS requested_course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_reference text;

CREATE INDEX IF NOT EXISTS idx_users_requested_course_id ON public.users(requested_course_id);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON public.users(is_verified);
```

Paste into **Supabase Dashboard → SQL Editor → Run**.

The `saveSignupRequest` action degrades gracefully if the migration is missing (still saves phone + verification flag), but `requested_course_id` and `payment_reference` will silently drop until the columns exist.

## Supabase Configuration

### Email Templates (required for OTP)

Both signup and forgot-password use **6-digit codes** from Supabase, not magic links. Update the email templates to include `{{ .Token }}`:

**Authentication → Email Templates → Confirm signup** — body must reference `{{ .Token }}` (the 6-digit code). Keep `{{ .ConfirmationURL }}` as a fallback link.

**Authentication → Email Templates → Reset Password** — same: include `{{ .Token }}` for the OTP, `{{ .ConfirmationURL }}` as fallback.

If you only ship the link, the OTP step will fail because the email contains no code for the user to type.

### Auth Settings

- **Site URL** — `https://your-domain.com` (or `http://localhost:3000` for dev)
- **Redirect URLs** — include `<site-url>/auth/callback`
- **Email confirmation** — required (the OTP step relies on it)

## Signup Flow

```
┌──────────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────────┐
│ User Details │ → │ Auth OTP │ → │ Payment Info │ → │ Preview Form │
└──────────────┘   └──────────┘   └──────────────┘   └──────────────┘
       │                │                 │                  │
   name, email,    Supabase signUp     QR + WhatsApp     Review +
   password,       sends 6-digit       CTA + optional    Submit →
   phone, course   code → verifyOtp    payment ref       writes profile
                   → user signed in                      → modal → /dashboard
                                                         → middleware →
                                                         /pending-verification
```

After submit:
- User is signed-in but `is_verified = false`
- Middleware redirects all dashboard requests to `/pending-verification`
- Admin reviews payment via WhatsApp + dashboard, then **Approves** (sets `is_verified = true` and auto-enrolls in `requested_course_id`) or **Rejects** (hard-deletes from auth + users)

## Forgot Password Flow

Single page (`/auth/forgot-password`), 3 stages:

1. **Email** — user enters email → `resetPasswordForEmail`
2. **Verify Code** — user enters 6-digit code → `verifyOtp({ type: 'recovery' })`
3. **New Password** — user sets new password → `updateUser({ password })` → signed out → redirect to login

The legacy `/auth/reset-password` page is preserved for any old recovery links still in inboxes.

## WhatsApp Configuration

The WhatsApp CTA on the payment step and the pending-verification page is hard-coded to:

- Display: `+977-9860120739`
- Link: `https://wa.me/9779860120739`

To change it, update both constants in:
- `src/components/organisms/auth/signup-stepper/payment-step.tsx`
- `src/app/pending-verification/page.tsx`

## Payment QR

Drop your payment QR image at `public/assets/payment-qr.png` (referenced from the payment step). If missing, the UI shows a graceful fallback message instead of a broken image.

## Validation Rules

Reusable Zod rules in `src/utils/validation.ts` enforce:

| Field | Rule |
|---|---|
| Email | Trimmed, lowercased, valid format, max 254 chars |
| Full name | 2–100 chars, Unicode letters + spaces/hyphens/dots/apostrophes |
| Phone | 10–16 chars, optional `+` prefix, regex `^\+?[1-9]\d{9,14}$` |
| Password | 8–72 chars, upper + lower + number + special, no spaces |
| OTP | Exactly 6 digits |
| Course ID | UUID or non-empty string |

All onboarding forms validate on blur (`mode: 'onTouched'`) so users see errors as they go.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_NAME` | App name shown in UI |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `RESEND_FROM_EMAIL` | From address (verified domain required) |
| `ADMIN_EMAIL` | Receives contact form + signup notifications |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |

## Email System

Resend handles transactional emails (welcome, signup notification, contact form). Templates live in `src/lib/email.ts`. Supabase auth emails (confirmation, password reset) use separate templates configured in the Supabase dashboard — see "Supabase Configuration" above.

## Admin Workflow

`/admin/users` shows all users with filters by role and verification status. For pending signups:

1. Filter by **Pending** status
2. Review the **Requested Course** column + payment reference
3. Verify the payment via WhatsApp/bank
4. **Approve & Enroll** (sets `is_verified = true` and inserts an `enrollments` row), or **Reject (Delete)** to hard-delete the account

`/admin/exams/[id]/questions` supports bulk question add: filters by subject + difficulty, multi-select with master "Select All", "Pick N random" button, and per-batch marks input.

## Key Patterns

- **Tailwind v4 gradients** — Use `bg-linear-to-br` (v4 canonical), not `bg-gradient-to-br`
- **Static class maps** — Dynamic classes like `bg-${color}/10` don't work with JIT; use static maps
- **Atomic design** — Components organized as atoms → molecules → organisms
- **Server actions** — All DB logic in `src/actions/` with `'use server'`
- **Hard reload after sign-out** — Sign-out call sites use `window.location.href = '/'` instead of `router.push()` to ensure middleware reads cleared cookies

## Deployment

Deploy to Vercel by connecting this repository and adding the environment variables in **Project Settings → Environment Variables**. Run the SQL migration on your production Supabase database before the first deploy.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Resend](https://resend.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
