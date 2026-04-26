@'
# Playto Payout Engine

**Production‑grade payout service for Indian freelancers and agencies.**  
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

2. Set up the database
CREATE DATABASE playto_db;
CREATE USER playto_user WITH PASSWORD 'Naresh@8177';
GRANT ALL PRIVILEGES ON DATABASE playto_db TO playto_user;

3. Backend setup
cd backend
python -m venv venv
venv\Scripts\activate       # Windows

pip install -r requirements.txt
python manage.py makemigrations payouts
python manage.py migrate
python manage.py seed_merchants   

4. Frontend setup
cd frontend   # or from the root if you keep src/ there
npm install

5. Run the application
cd backend
python manage.py runserver

Frontend
cd frontend   # or root if you have package.json there
npm start

📡 API Endpoints
GET /api/v1/merchants/{merchant_id}/balance/

Response:
{
  "id": "2bb9876b...",
  "name": "Acme Corp",
  "available_balance_paise": 500000,
  "held_balance_paise": 0
}

Request a Payout
POST /api/v1/merchants/{merchant_id}/payouts/
Headers:
  Idempotency-Key: <UUID>
Body:
{
  "amount_paise": 20000,
  "bank_account_id": "HDFC123"
}

Payout History
GET /api/v1/merchants/{merchant_id}/payouts/history/

🧪 Testing
python manage.py test payouts.tests.test_concurrency
python manage.py test payouts.tests.test_idempotency

⚙️ Configuration
DB_NAME=playto_db
DB_USER=playto_user
DB_PASSWORD=Naresh@8177
DB_HOST=localhost
DB_PORT=5432

📁 Project Structure
playto-payout-engine/
├── backend/
│   ├── core/                 # Django project settings
│   ├── payouts/              # main app
│   │   ├── migrations/
│   │   ├── management/commands/  # seed_merchants
│   │   ├── tests/                 # concurrency + idempotency
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── tasks.py
│   │   ├── utils.py
│   │   └── serializers.py
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── api.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── docker-compose.yml
├── README.md
└── EXPLAINER.md

📄 License
This project is for evaluation purposes only. Not for production use without proper security review.

👨‍💻 Author
Built for the Playto technical assignment.
Demonstrates idempotency, concurrency control, and a full‑stack payout engine.
'@ | Out-File -FilePath README.md -Encoding utf8

