# 🩸 SBAN: Smart Blood Availability Network

**Connecting Life to Life.** The global command center for medical emergency coordination and real-time blood tracking.

SBAN is a high-aesthetic, production-ready MERN stack application designed to revolutionize how blood inventory is tracked, donated, and synchronized across a decentralized network of hospitals and donors.

---

## ⚡ Core Features

### 🔵 Dynamic Hospital Dashboard
- **Interactive Inventory Management**: Color-coded stock cards (Green: Safe, Yellow: Low, Red: Critical) with real-time editing and auto-sync.
- **Operational Status Tracking**: At-a-glance visualization of medical logistics.

### 🔴 High-Aesthetic User Portal
- **Eligibility Synapse**: Real-time tracking of the 100-day donation protocol with an interactive progress bar.
- **Persistence Log**: A decentralized archive of all successful donations (Synapses).
- **Initialization Path**: Seamless onboarding flow from "Null Archive" to active contribution.

### ⚪ Emergency Coordination
- **Direct Map Access**: Instant integration with Google Maps to locate the nearest active blood nodes.
- **Emergency FAB**: High-visibility floating action button for immediate medical assistance.
- **Protocol-Driven Security**: JWT-based authentication with modern password-hashing hooks and protected routing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, Mongoose (MongoDB) |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |
| **Design System** | Glassmorphism, Semantic Typography (Outfit), HSL Color Scaling |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/your-repo/sban-network.git
cd sban-network
```

Setup the Backend:
```bash
cd server
npm install
# Create a .env file with JWT_SECRET and MONGO_URI
npm run dev
```

Setup the Frontend:
```bash
cd client
npm install
npm run dev
```

---

## 📂 Project Structure

```text
├── client/          # Vite + React (Glassmorphism UI)
│   ├── src/
│   │   ├── components/  # Reusable UI/Auth Components
│   │   ├── context/    # Global Auth State
│   │   ├── pages/      # Dashboards & Landing
│   │   └── api/        # Axios Configuration
└── server/          # Express/Node API
    ├── controllers/ # Business Logic (Auth, User, Inventory)
    ├── models/      # Mongoose Schemas (User, Hospital, Donation)
    ├── routes/      # Scalable API Endpoints
    └── middleware/  # Auth Guards & Error Handling
```

---

## 🎨 Design Philosophy
SBAN prioritizes **Visual Excellence** and **Micro-Animations**.
- **Glassmorphism**: Backdrop blurs and translucent layers for a modern, medical-grade aesthetic.
- **Real-time Feedback**: Status colors shift dynamically as data enters the network.
- **Accessible Typography**: Optimized line heights and high-contrast Slate/Coral palettes for clarity during critical emergency windows.

---

## ⚖️ License
This project is licensed under the MIT License - see the LICENSE file for details.
