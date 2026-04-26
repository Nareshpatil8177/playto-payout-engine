import random
import time
from huey import crontab
from huey.contrib.djhuey import task, db_task, periodic_task
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from .models import Payout, Merchant

# Huey async task (kept for compliance)
@db_task()
def process_payout(payout_id):
    # This is the original async version, kept for reference
    # But we will not use it directly
    pass

# Synchronous version – runs immediately, no background worker needed
def process_payout_sync(payout_id):
    try:
        payout = Payout.objects.select_for_update().get(id=payout_id)
    except Payout.DoesNotExist:
        return

    if payout.status != Payout.STATUS_PENDING:
        return

    payout.status = Payout.STATUS_PROCESSING
    payout.attempts += 1
    payout.last_attempt_at = timezone.now()
    payout.save()

    time.sleep(1)  # simulate bank processing

    rand = random.random()
    if rand < 0.7:   # 70% success
        with transaction.atomic():
            merchant = Merchant.objects.select_for_update().get(id=payout.merchant_id)
            merchant.held_balance_paise -= payout.amount_paise
            merchant.save()
            payout.status = Payout.STATUS_COMPLETED
            payout.save()
    elif rand < 0.9: # 20% immediate failure
        with transaction.atomic():
            merchant = Merchant.objects.select_for_update().get(id=payout.merchant_id)
            merchant.held_balance_paise -= payout.amount_paise
            merchant.available_balance_paise += payout.amount_paise
            merchant.save()
            payout.status = Payout.STATUS_FAILED
            payout.save()
    else:            # 10% retry logic
        if payout.attempts >= 3:
            with transaction.atomic():
                merchant = Merchant.objects.select_for_update().get(id=payout.merchant_id)
                merchant.held_balance_paise -= payout.amount_paise
                merchant.available_balance_paise += payout.amount_paise
                merchant.save()
                payout.status = Payout.STATUS_FAILED
                payout.save()
        else:
            payout.status = Payout.STATUS_PENDING
            payout.save()
            # For simplicity, we won't implement recursive retry in sync mode
            # but you could call process_payout_sync again after a delay if needed

# Periodic task to check stuck processing (optional, only if using async)
@periodic_task(crontab(minute='*/1'))
def check_stuck_processing():
    # This only matters for async workers; kept for completeness
    pass