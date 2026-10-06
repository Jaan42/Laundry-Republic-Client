# Laundry Republic

Laundry Republic is a full-stack, staff-facing Laundry Service Management System for managing customers, laundry services, promotions, orders, status tracking, automatic calculations, and business reports.

## Group Members

| Member | Role | Main Contribution |
|---|---|---|
| John | Backend / Server | Express API, MongoDB, business logic, reports, middleware |
| Rhianne | Client Core | Layout, landing page, dashboard, customers, shared UI |
| Adrian | Client Transactions | Services, promotions, orders, status tracking, reports |

## Technology Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, Axios, React Hook Form, Zod  
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose  
**Version Control:** Git and GitHub

## Main Features

- Landing Page and Dashboard
- Customer Management
- Laundry Service Management
- Promotion Management
- Create Order with server-calculated totals
- Promotion Validation
- Order Search, Filtering, Sorting, Details, and Editing
- Order Status Tracking
- Revenue Reports and Popular Services
- Responsive desktop and mobile interface

## Local Setup

### Client

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Run:

```bash
npm run dev
```

Build:

```bash
npm run build
```

### Server

```bash
npm install
npm run dev
```

Create the Server `.env` from `.env.example`.

Do not commit `.env`, database credentials, passwords, or tokens.

## API Documentation

Base URL:

```text
http://localhost:8000/api
```

| Method | Path | Purpose | Sample Request | Sample Response |
|---|---|---|---|---|
| GET | `/customers` | Get/search customers | `?search=Maria` | `[{"name":"Maria Santos"}]` |
| GET | `/customers/:id` | Get one customer | `/customers/<id>` | `{"name":"Maria Santos"}` |
| POST | `/customers` | Create customer | `{"name":"Juan","contactNumber":"09171234567"}` | `{"_id":"<id>","name":"Juan"}` |
| PUT | `/customers/:id` | Update customer | `{"name":"Juan Cruz"}` | `{"name":"Juan Cruz"}` |
| DELETE | `/customers/:id` | Delete customer | `/customers/<id>` | `{"message":"Customer deleted successfully"}` |
| GET | `/services` | Get/filter services | `?active=true` | `[{"name":"Wash & Dry","price":55}]` |
| GET | `/services/:id` | Get one service | `/services/<id>` | `{"name":"Wash & Dry","price":55}` |
| POST | `/services` | Create service | `{"name":"Blanket Cleaning","price":120,"pricingType":"perPiece","turnaroundDays":2}` | `{"_id":"<id>","name":"Blanket Cleaning"}` |
| PUT | `/services/:id` | Update service | `{"price":130}` | `{"price":130}` |
| DELETE | `/services/:id` | Delete service | `/services/<id>` | `{"message":"Service deleted successfully"}` |
| GET | `/promotions` | Get promotions | `/promotions` | `[{"code":"WELCOME5","discountPercentage":5}]` |
| GET | `/promotions/:id` | Get one promotion | `/promotions/<id>` | `{"code":"WELCOME5"}` |
| POST | `/promotions` | Create promotion | `{"code":"SAVE10","discountPercentage":10,"minimumAmount":500}` | `{"code":"SAVE10"}` |
| PUT | `/promotions/:id` | Update promotion | `{"minimumAmount":600}` | `{"minimumAmount":600}` |
| DELETE | `/promotions/:id` | Delete promotion | `/promotions/<id>` | `{"message":"Promotion deleted successfully"}` |
| POST | `/promotions/validate` | Validate promotion | `{"code":"WELCOME5","subtotal":350}` | `{"valid":true,"discountPercentage":5}` |
| GET | `/orders` | Get/search/filter/sort orders | `?status=Pending&sort=newest` | `[{"orderNumber":"LR-0001","status":"Pending"}]` |
| GET | `/orders/:id` | Get order details | `/orders/<id>` | `{"orderNumber":"LR-0001","grandTotal":332.5}` |
| POST | `/orders` | Create order | `{"customerId":"<id>","items":[{"serviceId":"<id>","quantity":5}]}` | `{"orderNumber":"LR-0021","status":"Pending"}` |
| PUT | `/orders/:id` | Update allowed order data | `{"additionalCharge":50,"notes":"Handle with care"}` | `{"additionalCharge":50}` |
| DELETE | `/orders/:id` | Delete order | `/orders/<id>` | `{"message":"Order and associated order items deleted successfully"}` |
| POST | `/orders/calculate` | Preview trusted totals | `{"items":[{"serviceId":"<id>","quantity":5}]}` | `{"subtotal":350,"grandTotal":350}` |
| PATCH | `/orders/:id/status` | Update order status | `{"status":"Washing"}` | `{"status":"Washing"}` |
| GET | `/orders/statistics` | Dashboard statistics | `/orders/statistics` | `{"totalOrders":20,"pendingOrders":4}` |
| GET | `/orders/revenue-summary` | Revenue report | `?startDate=2026-10-01&endDate=2026-10-31` | `{"totalRevenue":2793,"completedOrders":5}` |
| GET | `/orders/popular-services` | Popular services ranking | `/orders/popular-services` | `[{"totalOrders":6,"totalQuantity":48}]` |

## Order Status Workflow

```text
Pending → Washing → Drying → Ready for Pickup → Completed
   └──→ Cancelled
```

Invalid transitions are rejected by the server.

## Screenshots

```markdown
<img width="1901" height="971" alt="image" src="https://github.com/user-attachments/assets/b0b56c8e-d4ff-4bff-ba91-c46f17a36ead" />

<img width="1917" height="967" alt="image" src="https://github.com/user-attachments/assets/cebdc37e-1a3a-4b54-ab1f-a2b8eaa55d9b" />

<img width="1917" height="972" alt="image" src="https://github.com/user-attachments/assets/d74ba343-8a18-48a7-acdf-00a5f69c27f9" />

<img width="1917" height="965" alt="image" src="https://github.com/user-attachments/assets/f4c00a53-3a5e-4dd8-8d29-4ca65c037189" />

<img width="1917" height="963" alt="image" src="https://github.com/user-attachments/assets/0c3929b8-f8e5-4b1c-b39e-3660a7adaef1" />

<img width="1917" height="971" alt="image" src="https://github.com/user-attachments/assets/9ea6e65a-786a-4883-a066-b54d4637d8d7" />

<img width="1917" height="965" alt="image" src="https://github.com/user-attachments/assets/f482a02e-0334-4e26-972f-091ed758a495" />

<img width="1917" height="967" alt="image" src="https://github.com/user-attachments/assets/27302dfe-8eea-424d-a6c1-f7e0174dd488" />

```

## Known Limitations

- The backend and MongoDB Atlas must be available.
- Authentication and staff accounts are outside the project scope.
- Online payments, uploads, email/SMS, and real-time notifications are not implemented.
- Reports use lightweight cards and ranked lists instead of a chart library.
- No native mobile application or deployment configuration is included.

## Server Authority

The backend remains responsible for trusted values including:

- Service price snapshots
- Order totals and discounts
- Expected completion dates
- Promotion validation
- Order status transitions
- Dashboard statistics
- Revenue reports
