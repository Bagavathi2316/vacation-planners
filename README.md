# Vacation Planners – Travel & Booking Dashboard (React + Vite)

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in /dist

## Structure
- `src/App.jsx` – state, routing, CRUD handlers, dialogs
- `src/config.jsx` – entity definitions (columns, form fields, filters, rules)
- `src/data/seed.js` – sample data (in-memory; resets on reload)
- `src/components/` – reusable UI: DataTable, EntityForm, Modal/Dialogs, Toast, Badge, Charts, Dashboard, CalendarView, States, Sidebar

## New in this version
- **Payments module** (`src/config.jsx` → `pay`): record, edit, view and delete transactions (UPI, cards, net banking, cash). A booking's payment status updates automatically from its successful payments.
- Dashboard hero banner, pending-payments card, upcoming departures and a payment-methods chart.
- Card view for Destinations and Trips (toggle with Table), customer avatars, seat-fill meters and colour-coded calendar.
