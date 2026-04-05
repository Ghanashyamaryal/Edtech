# ITpro Entrance

Nepal's leading IT entrance exam preparation platform for BIT, BCA, BSc CSIT, and BIM. Built with Next.js 15 and Supabase.

## Features

- **Courses** — Browse and enroll in IT entrance exam courses
- **Study Notes** — Download notes, formula sheets, and study materials organized by subject
- **Live Classes** — Join interactive sessions with expert instructors
- **Recorded Lectures** — Watch recorded classes anytime
- **Mock Tests** — Practice with realistic entrance exam simulations
- **Admin Panel** — Manage courses, users, notes, and content
- **Role-based Access** — Student, Mentor, and Admin roles
- **Email Notifications** — Welcome emails, contact form alerts, and signup notifications via Resend

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4 (with `@theme` block)
- **Database & Auth** — Supabase (SSR with `@supabase/ssr`)
- **UI Components** — Radix UI + CVA for variants
- **Forms** — React Hook Form + Zod validation
- **Animations** — Framer Motion
- **Email** — Resend with custom HTML templates
- **Icons** — Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (landing)/          # Public landing pages
│   │   ├── courses/
│   │   ├── notes/
│   │   ├── online-classes/
│   │   ├── mock-tests/
│   │   ├── contact/
│   │   └── ...
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Student/mentor dashboard
│   └── admin/              # Admin panel
├── actions/                # Server actions (Supabase)
│   ├── courses.ts
│   ├── notes.ts
│   ├── live-classes.ts
│   ├── site-settings.ts
│   └── email.ts
├── components/
│   ├── atoms/              # Typography, RHF components
│   ├── molecules/
│   ├── organisms/          # Headers, footers
│   └── ui/                 # Reusable UI primitives
├── context/                # Auth context
├── lib/
│   ├── supabase/           # Supabase client/server
│   └── email.ts            # Resend + email templates
└── types/                  # TypeScript types
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_NAME` | App name shown in UI |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | From address (requires verified domain) |
| `ADMIN_EMAIL` | Email that receives contact form and signup notifications |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

## Email System

The app uses Resend to send transactional emails:

- **Welcome email** — Sent when an admin verifies a new user
- **Signup notification** — Sent to admin when someone registers
- **Contact form notification** — Sent to admin when the contact form is submitted

Email templates are defined in `src/lib/email.ts`. Supabase auth emails (confirmation, password reset) use separate templates configured in the Supabase dashboard.

## Key Patterns

- **Tailwind v4 gradients** — Use `bg-linear-to-br` (canonical v4 syntax), not `bg-gradient-to-br`
- **Static class maps** — Dynamic classes like `bg-${color}/10` don't work with JIT; use static maps instead
- **Atomic design** — Components are organized as atoms → molecules → organisms
- **Server actions** — All database logic lives in `src/actions/` with the `'use server'` directive

## Deployment

Deploy to Vercel by connecting this repository and adding the environment variables in **Project Settings → Environment Variables**.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Resend](https://resend.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
