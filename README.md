# Laundry Republic

Laundry Republic is a staff-facing frontend for managing a laundry business. It brings customer records, laundry services, promotions, order processing, operational status tracking, and business reports into one responsive web interface.

## Frontend stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod

## Local setup

Requirements:

- Node.js and npm
- The Laundry Republic Server running locally or at another reachable URL

Install dependencies:

```bash
npm install
```

Create a local `.env` file in the client project:

```env
VITE_API_URL=http://localhost:8000/api
```

Only expose values intended for browser use through `VITE_` variables. Do not place database credentials, passwords, or private tokens in the client environment.

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the configured lint checks:

```bash
npm run lint
```

## Implemented frontend features

- Public Landing Page
- Operational Dashboard
- Customer Management
- Laundry Service Management
- Promotion Management
- Create Order with server-calculated totals and promotion validation
- Order Management with search, date/status/amount filters, and sorting
- Order Details and backend-constrained editing
- Server-controlled Order Status Tracking
- Revenue Reports with preset and custom date ranges
- Popular Services ranking
- Responsive desktop and mobile layouts

## Server authority

The frontend displays and submits business inputs, while the server remains authoritative for order totals, price snapshots, discounts, expected completion dates, order status transitions, and report totals.

## Known limitations

- The Laundry Republic Server must be running and reachable through `VITE_API_URL`.
- Authentication and staff roles are outside the current project scope.
- Online payments, file uploads, email/SMS, and real-time notifications are not implemented.
- Reports use lightweight KPI cards and ranked lists rather than a charting library.
- This repository contains the web frontend only; it does not provide a native mobile application or deployment configuration.
