Got it ✅
I’ll prepare a **frontend design document in Markdown (`.md`) format** specifically for the **Bus Management Module**. This will outline the **pages, components, states, and APIs** for the **Next.js 15 (React 19)** frontend, styled with **Tailwind + Shadcn UI**.

---

# 🚍 Bus Management Module – Frontend Design (Next.js + Tailwind + Shadcn UI)

## **1. Overview**

The **Bus Management Module** in the frontend handles:

* Managing **Buses**
* Managing **Bus Drivers**
* Creating & displaying **Routes** (AI-generated via Google Maps API)
* Scheduling **Bus Trips**
* Visualizing **bus movements on maps**
* Linking buses to **events** and **supporters**

---

## **2. Pages**

### 🔹 `/buses`

**Purpose**: Manage bus fleet.
**Features**:

* List all buses (Table with search, filter by status).
* Add/Edit bus (modal form).
* View details (click row → detail page).

**Table Columns**:

* Bus Number
* License Plate
* Model
* Capacity
* Status (Active/Inactive/Maintenance)
* Actions (View/Edit/Delete)

---

### 🔹 `/drivers`

**Purpose**: Manage bus drivers.
**Features**:

* List drivers with assigned buses.
* Add/Edit driver details.
* Assign driver → bus.

**Table Columns**:

* Driver Name
* Phone
* Assigned Bus
* Salary
* Status (Active/Inactive/Fired)
* Actions (View/Edit/Delete)

---

### 🔹 `/routes`

**Purpose**: Manage AI-generated bus routes.
**Features**:

* Display all routes in a table.
* Show map preview (polyline).
* Generate route via Google Maps AI → store in DB.
* Link route to an event.

**Table Columns**:

* Route ID
* Origin → Destination
* Distance (km)
* Duration (min)
* Event (if linked)
* Status
* Actions (View/Edit/Delete/Map)

---

### 🔹 `/schedules`

**Purpose**: Manage bus trip schedules.
**Features**:

* Calendar + table view of schedules.
* Add schedule (assign bus, driver, route, event, departure/arrival).
* Set recurrence (daily/weekly/custom).
* Status lifecycle (Scheduled → In Progress → Completed).

**Table Columns**:

* Bus #
* Driver
* Route
* Departure Time
* Arrival Time
* Recurrence
* Status
* Actions (Edit/Cancel)

---

## **3. Components**

### 🚍 Bus Components

* `BusTable.tsx` – table for buses with filters.
* `BusForm.tsx` – form for add/edit bus.
* `BusCard.tsx` – compact display for dashboard view.

### 👨‍✈️ Driver Components

* `DriverTable.tsx`
* `DriverForm.tsx`
* `DriverAssignmentModal.tsx`

### 🗺️ Route Components

* `RouteTable.tsx`
* `RouteMap.tsx` (Google Maps with polyline rendering)
* `RouteForm.tsx` (origin/destination picker)

### 📅 Schedule Components

* `ScheduleTable.tsx`
* `ScheduleForm.tsx` (with recurrence rule selector)
* `ScheduleCalendar.tsx` (react-big-calendar integration)

---

## **4. State Management (Zustand)**

```ts
// busStore.ts
import { create } from "zustand";

export const useBusStore = create((set) => ({
  buses: [],
  drivers: [],
  routes: [],
  schedules: [],
  loading: false,

  setBuses: (buses) => set({ buses }),
  setDrivers: (drivers) => set({ drivers }),
  setRoutes: (routes) => set({ routes }),
  setSchedules: (schedules) => set({ schedules }),
}));
```

---

## **5. API Endpoints (Laravel Backend)**

### 🔹 Buses

* `GET /api/buses` – list buses
* `POST /api/buses` – create bus
* `PUT /api/buses/{id}` – update bus
* `DELETE /api/buses/{id}` – soft delete

### 🔹 Drivers

* `GET /api/drivers`
* `POST /api/drivers`
* `PUT /api/drivers/{id}`
* `DELETE /api/drivers/{id}`

### 🔹 Routes

* `GET /api/routes`
* `POST /api/routes` (AI generated)
* `PUT /api/routes/{id}`
* `DELETE /api/routes/{id}`

### 🔹 Schedules

* `GET /api/schedules`
* `POST /api/schedules`
* `PUT /api/schedules/{id}`
* `DELETE /api/schedules/{id}`

---

## **6. UI/UX Flow**

1. **Admin navigates to Bus Module**.
2. **Buses Tab** – manage fleet.
3. **Drivers Tab** – assign drivers.
4. **Routes Tab** – system suggests optimal route → admin approves.
5. **Schedules Tab** – create schedule, set recurrence, assign bus + driver + route.
6. **Calendar View** – visual check of schedules.
7. **Map View** – show live or planned routes.

---

## **7. Example UI Components (Shadcn UI + Tailwind)**

```tsx
// BusCard.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function BusCard({ bus }) {
  return (
    <Card className="p-4 shadow-md rounded-2xl">
      <CardHeader className="text-lg font-semibold">
        Bus #{bus.bus_number} – {bus.model}
      </CardHeader>
      <CardContent>
        <p>License: {bus.license_plate}</p>
        <p>Capacity: {bus.capacity}</p>
        <p>Status: {bus.status}</p>
      </CardContent>
    </Card>
  );
}
```

---

✅ This `.md` file is ready to be stored as **frontend documentation** for your Bus Module.
It explains **pages, components, states, APIs, and flow** → so any developer can directly start building.

---

Do you want me to also create a **wireframe mockup (boxes & layout sketch)** in Markdown for these pages (like `/buses`, `/schedules`)? That would make it easier to visualize before coding.
