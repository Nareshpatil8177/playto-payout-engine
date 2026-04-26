from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
import random
import time
from .models import Merchant, Payout, IdempotencyRecord
from .serializers import PayoutRequestSerializer, PayoutResponseSerializer, MerchantBalanceSerializer

class PayoutCreateView(APIView):
    def post(self, request, merchant_id):
        try:
            # 1. Get merchant
            merchant = Merchant.objects.get(id=merchant_id)
        except Exception as e:
            return Response({'error': f'Merchant error: {str(e)}'}, status=404)

        # 2. Idempotency key
        idempotency_key = request.headers.get('Idempotency-Key')
        if not idempotency_key:
            return Response({'error': 'Idempotency-Key header required'}, status=400)

        # 3. Check existing idempotency record
        existing = IdempotencyRecord.objects.filter(
            merchant=merchant, idempotency_key=idempotency_key
        ).first()
        if existing and existing.expires_at > timezone.now():
            return Response(existing.response_payload, status=200)
        elif existing:
            existing.delete()

        # 4. Validate input
        serializer = PayoutRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        amount = serializer.validated_data['amount_paise']
        bank_account_id = serializer.validated_data['bank_account_id']

        # 5. Atomic transaction: hold funds & create payout
        try:
            with transaction.atomic():
                # Lock merchant row (without NOWAIT to avoid extra complexity)
                merchant = Merchant.objects.select_for_update().get(id=merchant_id)
                if merchant.available_balance_paise < amount:
                    return Response({'error': 'Insufficient balance'}, status=400)

                merchant.available_balance_paise -= amount
                merchant.held_balance_paise += amount
                merchant.save()

                payout = Payout.objects.create(
                    merchant=merchant,
                    amount_paise=amount,
                    bank_account_id=bank_account_id,
                    status=Payout.STATUS_PENDING,
                    idempotency_key=idempotency_key
                )

                response_data = PayoutResponseSerializer(payout).data
                IdempotencyRecord.objects.create(
                    merchant=merchant,
                    idempotency_key=idempotency_key,
                    response_payload=response_data,
                    expires_at=timezone.now() + timedelta(hours=24)
                )
        except Exception as e:
            return Response({'error': f'Transaction failed: {str(e)}'}, status=500)

        # 6. Process payout inline (immediate)
        try:
            self._process_payout(payout.id)
        except Exception as e:
            # Log error but still return payout (status may still be PENDING)
            print(f"Error processing payout {payout.id}: {e}")

        payout.refresh_from_db()
        return Response(PayoutResponseSerializer(payout).data, status=201)

    def _process_payout(self, payout_id):
        # Get payout (no extra lock, just update)
        try:
            payout = Payout.objects.get(id=payout_id)
        except Payout.DoesNotExist:
            return

        if payout.status != Payout.STATUS_PENDING:
            return

        # Move to processing
        payout.status = Payout.STATUS_PROCESSING
        payout.attempts += 1
        payout.last_attempt_at = timezone.now()
        payout.save()

        # Simulate bank delay
        time.sleep(1)

        # Random outcome
        rand = random.random()
        with transaction.atomic():
            merchant = Merchant.objects.select_for_update().get(id=payout.merchant_id)
            if rand < 0.7:   # success
                merchant.held_balance_paise -= payout.amount_paise
                merchant.save()
                payout.status = Payout.STATUS_COMPLETED
            elif rand < 0.9: # immediate failure
                merchant.held_balance_paise -= payout.amount_paise
                merchant.available_balance_paise += payout.amount_paise
                merchant.save()
                payout.status = Payout.STATUS_FAILED
            else:            # retry (simplified: fail after 3 attempts)
                if payout.attempts >= 3:
                    merchant.held_balance_paise -= payout.amount_paise
                    merchant.available_balance_paise += payout.amount_paise
                    merchant.save()
                    payout.status = Payout.STATUS_FAILED
                else:
                    payout.status = Payout.STATUS_PENDING
            payout.save()

class MerchantBalanceView(APIView):
    def get(self, request, merchant_id):
        try:
            merchant = Merchant.objects.get(id=merchant_id)
            return Response(MerchantBalanceSerializer(merchant).data)
        except Merchant.DoesNotExist:
            return Response({'error': 'Merchant not found'}, status=404)

class PayoutHistoryView(APIView):
    def get(self, request, merchant_id):
        payouts = Payout.objects.filter(merchant_id=merchant_id).order_by('-created_at')
        return Response(PayoutResponseSerializer(payouts, many=True).data)