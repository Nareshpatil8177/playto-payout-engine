import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';
// Replace this with your actual merchant UUID (from seed_merchants output)
const MERCHANT_ID = '2bb9876b-f075-4adb-9e67-f6f4e47a5cff';

const api = axios.create({
  baseURL: API_BASE,
});

export const getBalance = () => api.get(`/merchants/${MERCHANT_ID}/balance/`);
export const createPayout = (amount, bankAccountId, idempotencyKey) => api.post(
  `/merchants/${MERCHANT_ID}/payouts/`,
  { amount_paise: amount, bank_account_id: bankAccountId },
  { headers: { 'Idempotency-Key': idempotencyKey } }
);
export const getPayoutHistory = () => api.get(`/merchants/${MERCHANT_ID}/payouts/history/`);
