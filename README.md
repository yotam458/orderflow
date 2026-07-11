# OrderFlow 📦 - Branch Order Management & Operations Platform

OrderFlow is a modern operations and management platform designed to streamline logistics, customer tracking, and team management at the branch level. Specifically built for high-efficiency environments (featuring a default dark mode to reduce eye strain), it enables order intake, customer tracking, team permissions, and complete audit logging of all branch activities.

---

## 🚀 Core Features

### 1. Order Management
- **Creation & Tracking:** Record new orders, associate them with new or existing customers, and document requested items.
- **Dynamic Status Updates:** Manage order status dynamically (`in_progress`, `ready`, `awaiting_update`, `delivered`).
- **Package Location Tracking:** Monitor physical item location in the branch (`in_store` / `on_the_way`).
- **Detailed Order Auditing:** View log history per order to see status transition timelines and who updated them.

### 2. Customer Management
- **Identity Matching:** Track customers using ID numbers, names, phone numbers, and email addresses.
- **Purchase History:** Access previous orders instantly to provide high-quality support.

### 3. Team Management & Roles
- **Built-in System Roles:** Supports three distinct levels of authorization:
  - 👑 **Branch Manager (Manager):** Full access to settings, communication templates, and employee management (Add, Edit, Delete).
  - 🛡️ **Shift Leader (Employee):** Manage daily operations, orders, and customer details, without staff management access.
  - 👤 **Salesperson (Seller):** Basic access to view and operate orders.
- **Safety Locks:** Prevents deleting the last remaining manager to avoid administrative lockout.
- **Secure Registration:** Managers can select custom passwords when adding new staff. Built-in toggles (eye icons) show/hide passwords, and custom input fields prevent browser autocomplete leaks.

### 4. Branch Audit Logs
- Automatically registers all system-level administration actions (such as adding/updating employee details) to ensure operational transparency.

### 5. Quick Customer Communication
- Generate pre-formatted notification messages using dynamic branch templates and launch them instantly via WhatsApp API (`wa.me`) or Email (`mailto:`).

---

## 🔌 Integrations & External Services

| Service / Integration | Description in System | Type |
| :--- | :--- | :--- |
| **Supabase** | Cloud database platform (PostgreSQL-based). Stores all system tables: orders, employees, customers, settings, and audit logs. Uses the `@supabase/supabase-js` client library. | Database (BaaS) |
| **WhatsApp API** | Integrates via the `wa.me` protocol. Allows quick-dispatching templated update messages to customer phone numbers. | Communication |
| **Email Protocol (`mailto:`)** | Launches local mail clients (Outlook, Gmail, etc.) with pre-filled subject and body templates featuring order details. | Communication |
| **Web Storage API** | Uses `sessionStorage` for secure session handling (automatic lockout prevention) and `localStorage` as a fallback local state database. | Storage |

---

## 🛠️ Tech Stack

- **React 19 & Vite:** Fast frontend runtime and build tooling.
- **Supabase Client:** Database interface layer.
- **React Icons (Feather Icons):** Unified iconography.
- **Vitest:** Test runner for DB client logic and QA checks.
- **Oxlint:** Fast linting tool.

---

## 📁 Database Schema

The database contains the following tables (defined in [schema.sql](./supabase/schema.sql)):
- **employees:** Staff profiles, role, password, and date of birth (`birthdate`).
- **customers:** Client list (name, phone, email, ID number).
- **orders:** Order records, status, location, and metadata.
- **order_audit:** Individual order event logs.
- **branch_audit:** System-wide management logs.
- **settings:** Global templates and branch preferences.

---

## 💻 Local Setup & Development

### 1. Install Dependencies
Install Node.js packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3. Run Development Server
Start the local Vite development server:
```bash
npm run dev
```
The server will start at: `http://localhost:5173/`.

### 4. Run Automated Tests
Run Vitest suites:
```bash
npm run test
```
To open the interactive test UI:
```bash
npm run test:ui
```

### 5. Run Linter
Audit styling and unused variables:
```bash
npm run lint
```

### 6. Build for Production
Bundle the project for production:
```bash
npm run build
```
