# Location Voiture — Architecture Document
## Multi-Tenant Vehicle Rental SaaS for the Moroccan Market

### Version: 0.1.0
### Last Updated: 2026-10-02

---

## 1. System Overview

Location Voiture is a production-grade, multi-tenant SaaS platform for vehicle rental businesses operating in Morocco. It provides fleet management, booking engines, legal compliance tooling, and offline inspection capabilities.

## 2. Tech Stack

| Layer | Technology | Free Tier |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript | Vercel Hobby |
| Styling | Tailwind CSS 4 with RTL/LTR dynamic support | — |
| Backend/API | Next.js Route Handlers + Supabase Edge Functions | Vercel + Supabase |
| Database | PostgreSQL 15 (Supabase) with RLS | Supabase Free (500MB) |
| Auth | Supabase Auth (JWT + RLS integration) | Supabase Free |
| Storage | Supabase Storage (vehicle photos, documents) | Supabase Free (1GB) |
| Realtime | Supabase Realtime (booking status updates) | Supabase Free |
| PWA/Offline | Workbox + IndexedDB (inspection module) | — |
| PDF Gen | @react-pdf/renderer + HarfBuzz (Arabic BiDi) | — |
| Deployment | Vercel (frontend) + Supabase (backend) | $0/month |

## 3. Multi-Tenant Architecture

### 3.1 Tenant Isolation Strategy: PostgreSQL Row-Level Security (RLS)

Every tenant-scoped table includes a `tenant_id UUID NOT NULL` column with a foreign key to `tenants.id`.

RLS policies use Supabase's JWT claims:
```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON <table>
  USING (tenant_id = (current_setting('request.jwt.claims', true)::json->>'tenant_id')::uuid);
```

### 3.2 Tenant Hierarchy
```
SuperAdmin (SaaS Owner)
  └── Tenant (Rental Agency)
        ├── Admin (Agency Owner)
        ├── Manager (Branch Manager)
        ├── Agent (Front Desk)
        └── Driver (delivery driver)
```

## 4. Database Design Principles

### 4.1 Concurrency Safety
- All bookings use `tsrange` with `[)` (inclusive-exclusive) bounds
- `EXCLUDE USING gist (vehicle_id WITH =, booking_period WITH &&)` prevents double-booking at the database level
- Requires `btree_gist` extension

### 4.2 Audit Trail
- All tables include `created_at`, `updated_at` timestamps
- Soft-delete via `deleted_at` column (never hard delete)
- Change history via PostgreSQL triggers → `audit_log` table

### 4.3 Moroccan Compliance
- **CNDP (Loi 09-08)**: CIN/Passport numbers stored as SHA-256 hashes only
- **NARSA**: Speeding ticket cross-referencing via `tsrange` booking ledger
- **DGSN**: Fiche de police PDF exports with Arabic BiDi rendering
- **Ministère du Transport**: Fleet compliance triggers (min 7 vehicles, max 5-year age)

## 5. API Architecture

### Route Structure
```
src/app/
├── (auth)/                    # Auth pages (login, register, forgot)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (dashboard)/               # Authenticated dashboard
│   ├── layout.tsx             # Sidebar + tenant context
│   ├── fleet/                 # Fleet management
│   ├── bookings/              # Booking engine
│   ├── inspections/           # Offline inspection PWA
│   ├── legal/                 # Contracts, NARSA, DGSN
│   ├── clients/               # Client CRM + blacklist
│   └── settings/              # Tenant settings
├── (superadmin)/              # SuperAdmin portal
│   ├── tenants/
│   ├── billing/
│   └── blacklist/
├── api/                       # API routes
│   ├── webhooks/
│   │   ├── iot/route.ts       # Teltonika Codec 8 ingestion
│   │   └── cmi/route.ts       # CMI VAD payment webhooks
│   ├── bookings/route.ts
│   └── fleet/route.ts
└── layout.tsx                 # Root layout (RTL/LTR, fonts)
```

## 6. Deployment Architecture ($0)

```
Internet
    │
    ▼
┌─────────────┐     ┌──────────────────────────┐
│   Vercel     │────▶│  Supabase Free Tier       │
│   (Hobby)    │     │  ┌─────────────────────┐  │
│              │     │  │ PostgreSQL 15 + RLS  │  │
│  Next.js App │     │  │ 500MB storage        │  │
│  Edge Funcs  │     │  └─────────────────────┘  │
│  Static CDN  │     │  ┌─────────────────────┐  │
│              │     │  │ Auth (50K users)     │  │
└─────────────┘     │  └─────────────────────┘  │
                    │  ┌─────────────────────┐  │
                    │  │ Storage (1GB)        │  │
                    │  └─────────────────────┘  │
                    │  ┌─────────────────────┐  │
                    │  │ Edge Functions       │  │
                    │  └─────────────────────┘  │
                    └──────────────────────────┘
```

## 7. Security Model

1. **Authentication**: Supabase Auth with JWT tokens
2. **Authorization**: RLS policies enforce tenant isolation at DB level
3. **PII Protection**: CIN/Passport hashed via SHA-256 before storage
4. **Secret Management**: All secrets in `.env.local` (never committed)
5. **CNDP Compliance**: Consent-based data processing, right to deletion
6. **Rate Limiting**: Vercel Edge middleware for API rate limiting

## 8. Offline Strategy

The inspection module (Milestone D) uses:
- **Service Worker**: Google Workbox with `BackgroundSyncPlugin`
- **Local Storage**: IndexedDB for inspection data + photos
- **Sync Strategy**: Queue-based — inspections sync when connectivity restored
- **Conflict Resolution**: Server-timestamp-wins with client notification
