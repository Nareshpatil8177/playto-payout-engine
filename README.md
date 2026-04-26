# Playto Payout Engine

A production‑grade payout service for Indian freelancers and agencies.  
Collect international payments in USD, settle automatically in INR with idempotency, concurrency control, and a beautiful real‑time dashboard.

---

## ✨ Features

- **Merchant Ledger** – Balances stored in paise (integer), derived from credits (simulated) and debits (payouts).
- **Idempotent Payout API** – `Idempotency-Key` header prevents duplicate requests (24h expiry, merchant‑scoped).
- **Concurrency Safe** – Row‑level `SELECT FOR UPDATE NOWAIT` locking prevents race conditions and overdraws.
- **State Machine** – `PENDING → PROCESSING → COMPLETED / FAILED`. No illegal transitions.
- **Background Processing** – Uses Huey (with immediate mode for easy setup, fully compatible with async workers).
- **Retry Logic** – Exponential backoff (2,4,8 seconds) up to 3 attempts; stuck payouts auto‑recover.
- **Live Dashboard** – React + Tailwind shows balance, payout form, and history with 5s auto‑refresh.
- **PostgreSQL** – All money amounts as `BigIntegerField` (paise).
- **Fully Tested** – Concurrency and idempotency tests included.

---

## 🛠️ Tech Stack

| Layer       | Technology                                         |
|-------------|----------------------------------------------------|
| Backend     | Django 4.2, Django REST Framework, Huey            |
| Database    | PostgreSQL (strongly recommended)                  |
| Worker      | Huey (in‑memory or Redis)                          |
| Frontend    | React 18, Tailwind CSS, Axios, UUID                |
| Testing     | Django TestCase + ThreadPoolExecutor               |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11 or 3.12 (3.13 may have issues with psycopg)
- PostgreSQL (≥ 14)
- Node.js (≥ 18) & npm
- (Optional) Redis if you want a separate worker instead of immediate mode

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/playto-payout-engine.git
cd playto-payout-engine