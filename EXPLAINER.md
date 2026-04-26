# Explainer Answers

## 1. The Ledger

We do not calculate balance using SUM queries on every request. Instead, we store balances directly in the Merchant model using:

- available_balance_paise
- held_balance_paise

This improves performance and avoids race conditions.

Balance updates are done atomically using database transactions and row-level locking.

Example:

from django.db import transaction

with transaction.atomic():
    merchant = Merchant.objects.select_for_update().get(id=merchant_id)
    merchant.available_balance_paise -= amount
    merchant.held_balance_paise += amount
    merchant.save()

---

## 2. The Lock

Code:

from django.db import connection

def acquire_merchant_lock(merchant_id):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT id FROM payouts_merchant WHERE id = %s FOR UPDATE NOWAIT",
            [merchant_id]
        )
        return cursor.fetchone() is not None

Explanation:

This uses PostgreSQL SELECT FOR UPDATE NOWAIT to lock the merchant row.

- Only one transaction can modify the row at a time
- If another transaction already holds the lock, this fails immediately
- We return 409 Conflict instead of waiting

This prevents concurrent payouts from overdrawing balance.

---

## 3. The Idempotency

We store an IdempotencyRecord with:

- merchant
- idempotency_key (unique)
- response
- expiry (24 hours)

Before processing:

- If key exists → return stored response
- If not → process payout and store result

If two requests come at the same time:

- Second request hits unique constraint
- Raises IntegrityError
- We catch it and return the already created response

This ensures only one payout per key.

---

## 4. The State Machine

Code:

if payout.status != Payout.STATUS_PENDING:
    return

Only allowed transitions:

- PENDING → PROCESSING → COMPLETED
- PENDING → PROCESSING → FAILED

Not allowed:

- FAILED → COMPLETED
- Any backward transition

Only the payout processor updates status, not the API.

---

## 5. The AI Audit

AI gave this wrong code:

with transaction.atomic():
    merchant = Merchant.objects.get(id=merchant_id)
    if merchant.available_balance_paise >= amount:
        merchant.available_balance_paise -= amount
        merchant.save()
        payout = Payout.objects.create(...)

Problem:

- No locking
- Two requests can read same balance
- Both deduct → overdraft

Fixed code:

with transaction.atomic():
    merchant = Merchant.objects.select_for_update().get(id=merchant_id)
    if merchant.available_balance_paise >= amount:
        merchant.available_balance_paise -= amount
        merchant.held_balance_paise += amount
        merchant.save()
        payout = Payout.objects.create(...)

This uses row-level locking and prevents race conditions.
