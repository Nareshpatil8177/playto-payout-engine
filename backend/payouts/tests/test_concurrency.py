from django.test import TransactionTestCase
from concurrent.futures import ThreadPoolExecutor
from rest_framework.test import APIRequestFactory
from payouts.models import Merchant
from payouts.views import PayoutCreateView

class ConcurrencyTest(TransactionTestCase):
    def setUp(self):
        self.merchant = Merchant.objects.create(
            name='Test Merchant',
            available_balance_paise=10000,
            held_balance_paise=0
        )
        self.factory = APIRequestFactory()

    def test_concurrent_payouts_no_overdraw(self):
        def make_request():
            request = self.factory.post(
                f'/api/v1/merchants/{self.merchant.id}/payouts/',
                {'amount_paise': 6000, 'bank_account_id': 'ACC123'},
                HTTP_IDEMPOTENCY_KEY='key1'
            )
            view = PayoutCreateView()
            response = view.post(request, merchant_id=self.merchant.id)
            return response.status_code

        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = [executor.submit(make_request) for _ in range(2)]
            results = [f.result() for f in futures]

        success_count = sum(1 for r in results if r == 201)
        failure_count = sum(1 for r in results if r == 400 or r == 409)

        self.assertEqual(success_count, 1)
        self.assertEqual(failure_count, 1)

        self.merchant.refresh_from_db()
        self.assertEqual(self.merchant.available_balance_paise, 4000)
        self.assertEqual(self.merchant.held_balance_paise, 6000)