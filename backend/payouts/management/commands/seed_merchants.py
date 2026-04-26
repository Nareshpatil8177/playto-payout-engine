from django.core.management.base import BaseCommand
from payouts.models import Merchant

class Command(BaseCommand):
    help = 'Seed merchants with credit history'

    def handle(self, *args, **options):
        merchants = [
            {'name': 'Acme Corp', 'balance': 500000},
            {'name': 'Beta LLC', 'balance': 250000},
            {'name': 'Gamma Inc', 'balance': 100000},
        ]
        for m in merchants:
            merchant = Merchant.objects.create(
                name=m['name'],
                available_balance_paise=m['balance'],
                held_balance_paise=0
            )
            self.stdout.write(f'Created merchant {merchant.name} (ID: {merchant.id}) with balance {merchant.available_balance_paise} paise')