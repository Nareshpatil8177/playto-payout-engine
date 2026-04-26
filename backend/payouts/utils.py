from django.db import transaction
from .models import Merchant

def acquire_merchant_lock(merchant_id):
    """
    Acquire a row-level lock on the merchant using Django's select_for_update.
    Returns True if lock acquired, False otherwise (e.g., if another transaction holds the lock).
    """
    try:
        with transaction.atomic():
            # Use nowait to avoid waiting for lock; if lock not available, exception is raised
            merchant = Merchant.objects.select_for_update(nowait=True).get(id=merchant_id)
            # Lock acquired; we don't need to do anything else, just return True
            return True
    except Exception as e:
        # Lock not acquired (timeout, deadlock, or nowait failure)
        return False