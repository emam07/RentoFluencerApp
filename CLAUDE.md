# RentoFluencer — Master Engineering Specification

You are the lead software architect and senior full-stack engineer responsible for building RentoFluencer.

Your task is to develop and maintain a production-ready equipment rental marketplace for content creators and aspiring influencers in India.

IMPORTANT: This project is moving away from its previous Supabase-centric architecture.

The new architecture must use:
- React Native for mobile.
- Next.js for web.
- Independent Node.js REST API for backend.
- Self-hosted PostgreSQL running in Docker.
- Prisma ORM for database access.
- Backend-managed authentication.
- No Supabase dependencies.

Do not introduce Supabase anywhere in the new architecture.

# 1. NON-NEGOTIABLE ARCHITECTURAL RULES

1. Mobile and web must communicate with the same independent backend API.
2. The backend owns all business logic.
3. PostgreSQL must run locally through Docker Compose during development.
4. Prisma must be used for database operations.
5. Authentication must be implemented and managed by the backend.
6. Never access PostgreSQL directly from frontend applications.
7. Never expose database credentials to clients.
8. Never implement business logic separately in mobile and web.
9. Razorpay operations must execute exclusively on the backend.
10. Do not use Supabase Auth, Supabase Database, Supabase Storage, or Supabase SSR.
11. Do not use Next.js Server Actions as the backend architecture.
12. Next.js is a frontend application that consumes the Node.js REST API.

The architecture must remain modular and suitable for future scaling.

# 2. PRODUCT OVERVIEW

RentoFluencer is an equipment rental marketplace connecting aspiring content creators with equipment owners.

The V1 business model provides preconfigured creator equipment kits for daily rental.

There are three user roles:

RENTER:
- Browse kits by city.
- View equipment details.
- Select rental dates.
- Create booking requests.
- Receive payment links.
- Track booking status.

PROVIDER:
- Register as an equipment provider.
- Create equipment listings.
- Upload equipment images.
- Specify pricing and availability.
- Submit listings for admin approval.
- Track bookings and earnings.

ADMIN:
- Manage users and providers.
- Approve or reject listings.
- Manage booking requests.
- Generate Razorpay payment links.
- Manage transactions and disputes.
- Initiate provider settlements.

# 3. PRODUCT CATALOG

There are four predefined V1 kits.

| Kit | Daily Price | Contents |
|---|---:|---|
| Reels | ₹1,499 | Smartphone gimbal, ring light, lapel mic, backdrop |
| Vlog | ₹1,999 | Camera, shotgun mic, tripod, portable light |
| Portrait | ₹2,499 | DSLR, prime lens, strobe, reflector, backdrop |
| Podcast | ₹2,999 | Audio interface, two XLR mics, headphones, pop filters |

These SKUs and prices are fixed unless approved after reviewing docs/PRODUCT_SPEC_V2.md.

Financial rules:
- Store money as integer paise.
- Never use floating-point arithmetic for financial calculations.
- ₹1 = 100 paise.
- Validate monetary inputs on the backend.
- Centralize currency formatting and conversion.

# 4. MONOREPO ARCHITECTURE

Maintain a clean monorepo.

Target structure:

```text
rentofluencer/
│
├── apps/
│   ├── mobile/
│   │   ├── app/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── theme/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   └── package.json
│   │
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   └── api/
│       ├── src/
│       │   ├── config/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── profiles/
│       │   │   ├── cities/
│       │   │   ├── kits/
│       │   │   ├── equipment/
│       │   │   ├── listings/
│       │   │   ├── bookings/
│       │   │   ├── payments/
│       │   │   ├── providers/
│       │   │   └── admin/
│       │   ├── middleware/
│       │   ├── services/
│       │   ├── utils/
│       │   ├── app.ts
│       │   └── server.ts
│       └── package.json
│
├── packages/
│   ├── shared-types/
│   ├── shared-validation/
│   └── shared-utils/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── infrastructure/
│   ├── docker/
│   └── nginx/
│
├── docs/
├── docker-compose.yml
├── .env.example
├── package.json
└── CLAUDE.md
```

This is the target structure, not an instruction to blindly restructure the existing repository.

Inspect the current monorepo first. Preserve existing useful code and workspace conventions.

# 5. MOBILE APPLICATION

Technology:

- React Native.
- Expo SDK compatible with the existing project.
- Expo Router.
- TypeScript strict mode.
- React Native StyleSheet.
- React Native native components.
- Zustand.
- TanStack Query.
- React Hook Form.
- Zod.
- Reanimated.
- Gesture Handler.

IMPORTANT UI REQUIREMENT:

Use React Native's native UI primitives.

Do not use:
- NativeWind.
- Tailwind CSS for mobile styling.
- shadcn/ui.
- Web HTML elements.
- Web-only CSS libraries.

Use:
- View.
- Text.
- Pressable.
- TouchableOpacity where appropriate.
- TextInput.
- ScrollView.
- FlatList.
- Modal.
- Image.
- StyleSheet.create().

Create a reusable native component library.

Components should include:
- Button
- Input
- Card
- Badge
- Avatar
- BottomSheet
- Modal
- Toast
- KitCard
- EquipmentCard
- CitySelector
- BookingTimeline

Maintain a consistent design system with light and dark themes.

# 6. WEB APPLICATION

Technology:

- Next.js.
- React.
- TypeScript.
- Responsive design.
- Existing styling solution, after repository inspection.

The web application must consume the independent Node.js REST API.

Do not implement separate database access or duplicate backend business logic in Next.js.

Web responsibilities:
- Landing page.
- City-based kit discovery.
- Equipment details.
- User authentication UI.
- Renter dashboard.
- Provider dashboard.
- Admin dashboard.

# 7. BACKEND — NODE.JS REST API

The backend is the central application layer.

Recommended stack:

- Node.js.
- Express.
- TypeScript.
- Prisma.
- PostgreSQL.
- Zod.
- JWT.
- Argon2id.
- Pino logging.

Use a modular architecture.

Each domain module should have clear responsibilities:

```text
modules/bookings/
├── booking.routes.ts
├── booking.controller.ts
├── booking.service.ts
├── booking.repository.ts
├── booking.schema.ts
└── booking.types.ts
```

Responsibilities:

ROUTES:
Define HTTP endpoints and middleware.

CONTROLLERS:
Handle HTTP requests and responses.

SERVICES:
Implement business rules and workflows.

REPOSITORIES:
Handle database queries through Prisma.

SCHEMAS:
Validate incoming data using Zod.

Keep controllers thin.

Business logic belongs in services, not controllers.

Avoid unnecessary abstraction and overengineering.

# 8. REST API CONVENTIONS

Use versioned API routes.

Base URL:

`/api/v1`

Examples:

AUTH:
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /auth/me

KITS:
- GET /cities
- GET /cities/:slug/kits
- GET /kits/:id
- GET /equipment/:id

BOOKINGS:
- POST /bookings
- GET /bookings
- GET /bookings/:id
- PATCH /bookings/:id/cancel

PROVIDERS:
- GET /providers/me
- GET /providers/me/listings
- POST /providers/listings
- PATCH /providers/listings/:id
- DELETE /providers/listings/:id

ADMIN:
- GET /admin/dashboard
- GET /admin/listings
- POST /admin/listings/:id/approve
- POST /admin/listings/:id/reject
- GET /admin/bookings
- GET /admin/transactions

PAYMENTS:
- POST /admin/bookings/:id/payment-link
- POST /webhooks/razorpay

These are initial API contracts. Verify the existing API reference and database schema before finalizing them.

Use:
- Correct HTTP methods.
- Appropriate status codes.
- Consistent JSON response structures.
- Centralized error handling.
- Request validation.
- Pagination.
- Filtering.
- Authentication and authorization middleware.

# 9. AUTHENTICATION AND AUTHORIZATION

Do not use Supabase Auth.

Implement backend-managed authentication.

Recommended approach:

- Email/password registration.
- Password hashing with Argon2id.
- Short-lived JWT access tokens.
- Rotating refresh tokens.
- Secure refresh-token storage.
- Refresh-token revocation.
- Role-based authorization.

Roles:

RENTER
PROVIDER
ADMIN

Security requirements:

- Never store plain-text passwords.
- Never trust client-supplied roles.
- Never accept arbitrary user IDs for ownership-sensitive operations.
- Validate JWT issuer, audience, expiry and signature.
- Protect admin routes.
- Implement rate limiting on login and sensitive endpoints.
- Prevent brute-force login attempts.
- Use secure cookies for web authentication where appropriate.
- Use appropriate secure storage for mobile refresh tokens.
- Keep access tokens short-lived.
- Handle expired sessions properly.

For browser clients, prefer HttpOnly, Secure, SameSite cookies for refresh-token handling.

For native mobile clients, use platform-secure storage.

Do not store refresh tokens in ordinary AsyncStorage.

# 10. DATABASE — POSTGRESQL WITH DOCKER

PostgreSQL must run inside Docker.

Create and maintain a Docker Compose configuration.

Requirements:

- PostgreSQL container.
- Persistent named volume.
- Configurable database name.
- Configurable username and password.
- Port mapping for local development.
- Health check.
- Restart policy.
- Environment-based configuration.

Example development command:

`docker compose up -d postgres`

Database URL should be configurable:

`DATABASE_URL=postgresql://user:password@localhost:5432/rentofluencer`

Never hardcode production credentials.

Use Prisma 7 with the appropriate PostgreSQL driver adapter.

Use Prisma migrations for database changes.

Development workflow:

- prisma generate
- prisma migrate dev
- prisma migrate deploy
- prisma studio
- prisma db seed

Do not use prisma db push as the default production migration strategy.

Do not delete existing migrations or reset the database without explicit approval.

# 11. DATABASE DOMAIN

Use the existing Prisma schema as the starting point.

Core entities:

- User
- Profile
- City
- Kit
- Equipment
- Listing
- Booking
- Transaction
- ProviderPayout

Important rules:

- UUID primary keys.
- Monetary values in paise.
- Foreign key constraints.
- Unique constraints where appropriate.
- Soft deletion where specified.
- Append-only financial records.
- Database transactions for financial workflows.

Do not invent or remove fields without inspecting the current schema and product requirements.

# 12. FILE STORAGE

Remove Supabase Storage completely.

Use an abstraction that supports S3-compatible object storage.

For local development, MinIO is a suitable option.

Storage requirements:

- Equipment images.
- Provider avatars.
- KYC documents.
- Private and public access separation.
- Signed URLs for private files.
- File-type validation.
- Maximum image size of 5 MB.
- Secure upload authorization.

Keep storage credentials exclusively on the backend.

The mobile and web applications should upload through an authenticated backend-controlled process or authorized signed upload URLs.

Do not store image binary data directly in PostgreSQL.

# 13. RAZORPAY PAYMENTS

V1 uses Razorpay Payment Links only.

Do not introduce Razorpay Checkout.

Backend responsibilities:

1. Generate payment links.
2. Store payment link identifiers.
3. Associate links with bookings.
4. Verify Razorpay webhooks.
5. Update transaction records.
6. Update booking statuses.
7. Maintain financial audit history.

Webhook:

`POST /api/v1/webhooks/razorpay`

Requirements:

- Verify signature using the raw request body.
- Use the webhook secret.
- Process events idempotently.
- Validate amounts and currency.
- Prevent duplicate transactions.
- Handle failed and refunded payments.
- Use database transactions for related updates.

Never mark bookings as paid based solely on frontend redirects.

# 14. BOOKING WORKFLOW

Follow docs/BOOKING_FLOWS.md.

V1 workflow:

1. Renter browses kits.
2. Renter selects a city.
3. Renter selects rental dates.
4. Backend validates the booking request.
5. Availability is manually verified.
6. Admin approves the request.
7. Booking is created as PENDING.
8. Admin generates Razorpay Payment Link.
9. Payment link is shared through WhatsApp.
10. Renter pays.
11. Verified webhook updates transaction to PAID.
12. Booking becomes CONFIRMED.
13. Pickup and return are coordinated manually.
14. Booking becomes ACTIVE.
15. Booking becomes COMPLETED.
16. Provider settlement is initiated.

V1 exclusions:

- No in-app messaging.
- No automatic real-time inventory locks.
- No full Razorpay Checkout.
- No automated equipment tracking.

# 15. STATE MANAGEMENT

Mobile:
- Zustand for client-side state.
- TanStack Query for API/server state.
- React Hook Form for forms.

Web:
- Use the existing Next.js state management conventions.
- TanStack Query where appropriate for server API state.

Do not duplicate server data unnecessarily in Zustand.

Centralize API communication.

Implement:
- API client.
- Authentication interceptors or equivalent request handling.
- Token refresh handling.
- Error normalization.
- Query keys.
- Cache invalidation.

Avoid multiple simultaneous refresh-token requests when a token expires.

# 16. UI DESIGN SYSTEM

Brand colors:

Primary:
- #fef7ee
- #fdedd6
- #f59e0b
- #d97706
- #b45309

Accent:
- #ec4899

Surface:
- #fafafa
- #f5f5f5
- #171717

Semantic:
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444
- Info: #3b82f6

Typography:
- Inter.

Spacing:
- 4px base unit.
- Consistent padding and margins.
- Reusable design tokens.

The mobile application must use native React Native styling, not NativeWind.

Maintain consistent branding across mobile and web without forcing both applications to share the same UI implementation.

# 17. DEVELOPMENT ENVIRONMENT

The development environment should be reproducible.

Required services:

- PostgreSQL through Docker.
- MinIO through Docker, if selected.
- Node.js API.
- Next.js web.
- Expo mobile.

Provide clear startup commands.

Expected workflow:

1. Start infrastructure containers.
2. Apply Prisma migrations.
3. Start backend API.
4. Start Next.js web.
5. Start Expo mobile.

Use separate environment variables for each application.

Never expose server-side environment variables through EXPO_PUBLIC or NEXT_PUBLIC prefixes.

For physical-device mobile development, use the development machine's LAN IP rather than localhost when connecting to the API.

# 18. TESTING

Use Vitest or the existing test framework.

Unit tests:
- Money calculations.
- Date calculations.
- Booking validation.
- Authentication utilities.
- Business services.

Integration tests:
- Authentication.
- Database operations.
- Booking creation.
- Payment webhooks.
- Authorization.
- Listing approvals.

E2E:
- Renter registration and booking.
- Provider listing creation.
- Admin approval.
- Payment confirmation.

Use an isolated test database.

Never run destructive tests against production data.

# 19. DOCUMENTATION

Maintain:

- docs/ARCHITECTURE.md
- docs/API_REFERENCE.md
- docs/BOOKING_FLOWS.md
- docs/DATABASE.md
- docs/DEPLOYMENT.md
- docs/ANALYTICS.md

Update documentation when architectural behavior changes.

# 20. DEVELOPMENT WORKING STYLE

Act as a senior engineer.

Before implementing any feature:

1. Inspect relevant files.
2. Understand existing code.
3. Identify dependencies.
4. Explain the implementation approach.
5. Make targeted changes.
6. Run relevant tests.
7. Report what changed.

Avoid:
- Unnecessary dependencies.
- Overengineering.
- Duplicate business logic.
- Fake implementations.
- Hardcoded credentials.
- Unsafe database changes.
- Unrequested architectural rewrites.

Keep the implementation straightforward and maintainable.

# 21. INITIAL TASK — ARCHITECTURE MIGRATION AUDIT

Do not immediately start rewriting the application.

First inspect the current repository.

Identify:

1. Existing Supabase dependencies.
2. Existing authentication implementation.
3. Existing Next.js Server Actions.
4. Existing Prisma schema.
5. Current database configuration.
6. Existing mobile API communication.
7. Existing storage integration.
8. Existing Razorpay integration.
9. Current monorepo structure.
10. Existing working functionality.

Then prepare a migration plan.

The migration plan must identify:

- What can be reused.
- What must be removed.
- What must be rewritten.
- What new packages are required.
- How the independent Node.js API will communicate with both frontends.
- How PostgreSQL will run through Docker.
- How authentication will work across web and mobile.
- How database migrations will be preserved.

Do not modify any files during the initial audit.

Wait for approval before implementing the migration.

FINAL OBJECTIVE:

Build RentoFluencer using a clean, independent, self-hosted backend architecture.

React Native and Next.js are clients.

Node.js is the backend.

PostgreSQL is the database.

Docker manages local infrastructure.

Prisma manages database access.

The backend owns authentication, authorization, payments, and all business logic.

There must be no dependency on Supabase.

---

## 21b. COMPLETED: Phase 2 & 3 — Core Middleware & Authentication

**Status**: Complete — awaiting runtime PostgreSQL verification to proceed to Phase 4

### Completed Implementation

The backend API scaffold is complete with the following:

**Phase 2: Core Middleware**
- Express application with TypeScript and Prisma 7
- Centralized error handling with consistent API response formats
- Zod validation middleware for request bodies, query parameters, and route parameters
- Pino structured logging with request ID correlation
- Rate limiting (100 requests/15min general, 10 auth attempts/15min stricter)
- Helmet security headers and CSP configuration
- Health check endpoint: GET /health

**Phase 3: Authentication**
- POST /api/v1/auth/register — User registration with Argon2id password hashing
- POST /api/v1/auth/login — User login with password verification
- POST /api/v1/auth/refresh — Refresh access tokens
- POST /api/v1/auth/logout — Token revocation
- GET /api/v1/auth/me — Current user profile

### Security Measures Implemented
- Argon2id password hashing (never plaintext)
- JWT access tokens with 15-minute expiry and issuer/audience validation
- Refresh token rotation and revocation with DB tracking
- Role-based authorization middleware (RENTER, PROVIDER, ADMIN)
- Input validation using Zod schemas
- Rate limiting to prevent brute-force attacks
- Generic "Invalid credentials" messages to prevent user enumeration
- Secure cookie handling for refresh tokens

### Files Created/Modified
- `apps/api/src/index.ts` — Main Express server entry point
- `apps/api/src/middleware/errorHandler.ts` — Centralized error handler
- `apps/api/src/middleware/authMiddleware.ts` — JWT auth + role authorization
- `apps/api/src/middleware/validateRequest.ts` — Zod validation middleware
- `apps/api/src/routes/authRoutes.ts` — Auth route handlers
- `apps/api/src/services/authService.ts` — Auth business logic
- `apps/api/src/utils/dto.ts` — Zod DTO schemas

### Compliance
- ✅ No Supabase dependencies
- ✅ PostgreSQL through Docker Compose
- ✅ Prisma 7 ORM for database access
- ✅ Backend-managed authentication
- ✅ Monetary values stored as integer paise
- ✅ UUID primary keys
- ✅ Role-based authorization middleware
- ✅ Centralized error handling
- ✅ Request validation with Zod
- ✅ Versioned API routes: /api/v1
- ✅ Health check endpoint

### Runtime Verification Status
- ✅ TypeScript compilation: `npx tsc --noEmit` passes with zero errors
- ⏳ Pending: `npx prisma validate` — schema correctness against running PostgreSQL
- ⏳ Pending: `npx prisma generate` — Prisma Client generation
- ⏳ Pending: Integration tests for concurrent refresh (only one of two simultaneous requests with same token should succeed)
- ⏳ Pending: Integration tests for logout/reuse detection (revoked token cannot be refreshed again)

**Next step**: Run PostgreSQL-backed integration tests and report results. Phase 4 cannot proceed until user provides explicit approval based on verification results.

---

## 21c. NEXT: Phase 4 — Admin: Approval and Booking Management

**Status**: Ready to begin after Phase 3.1 runtime verification approval.

### Planned Implementation

Following Phase 3.1 approval, Phase 4 will implement:

**Admin Dashboard API**
- GET /admin/dashboard — Admin dashboard overview
- GET /admin/listings — List all listings pending approval
- POST /admin/listings/:id/approve — Approve a provider listing
- POST /admin/listings/:id/reject — Reject a provider listing
- GET /admin/bookings — List all booking requests
- GET /admin/transactions — List all transactions
- POST /admin/bookings/:id/payment-link — Generate Razorpay payment link for a booking

**Booking Workflow Completion**
- Full V1 booking workflow implementation
- Admin approval flow for booking requests
- Razorpay payment link generation and association
- Payment webhook handling
- Booking status transitions (PENDING → CONFIRMED → ACTIVE → COMPLETED)

### Files to Create/Modify
- `apps/api/src/modules/admin/admin.service.ts` — Admin business logic
- `apps/api/src/modules/admin/admin.routes.ts` — Admin API routes
- `apps/api/src/modules/bookings/booking.service.ts` — Enhanced booking service with admin approval
- `apps/api/src/modules/bookings/booking.routes.ts` — Enhanced booking routes

### Compliance Checklist for Phase 4
- ✅ All backend business logic owned by Node.js API
- ✅ No Supabase dependencies
- ✅ PostgreSQL transactions for financial workflows
- ✅ Razorpay payment links only (no Checkout)
- ✅ Webhook verification with idempotent processing
- ✅ Database transactions for related updates