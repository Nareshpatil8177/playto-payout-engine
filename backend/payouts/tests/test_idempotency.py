from django.test import TestCase
from rest_framework.test import APIRequestFactory
from payouts.models import Merchant, Payout
from payouts.views import PayoutCreateView

class IdempotencyTest(TestCase):
    def setUp(self):
        self.merchant = Merchant.objects.create(
            name='Test Merchant',
            available_balance_paise=10000,
            held_balance_paise=0
        )
        self.factory = APIRequestFactory()

    def test_idempotency_returns_same_response(self):
        request1 = self.factory.post(
            f'/api/v1/merchants/{self.merchant.id}/payouts/',
            {'amount_paise': 5000, 'bank_account_id': 'ACC123'},
            HTTP_IDEMPOTENCY_KEY='same-key'
        )
        view = PayoutCreateView()
        response1 = view.post(request1, merchant_id=self.merchant.id)

        request2 = self.factory.post(
            f'/api/v1/merchants/{self.merchant.id}/payouts/',
            {'amount_paise': 5000, 'bank_account_id': 'ACC123'},
            HTTP_IDEMPOTENCY_KEY='same-key'
        )
        response2 = view.post(request2, merchant_id=self.merchant.id)

        self.assertEqual(response1.status_code, 201)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response1.data, response2.data)

        payouts = Payout.objects.filter(merchant=self.merchant)
        self.assertEqual(payouts.count(), 1)