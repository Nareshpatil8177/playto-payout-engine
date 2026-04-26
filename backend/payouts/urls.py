from django.urls import path
from .views import PayoutCreateView, MerchantBalanceView, PayoutHistoryView

urlpatterns = [
    path('merchants/<uuid:merchant_id>/balance/', MerchantBalanceView.as_view()),
    path('merchants/<uuid:merchant_id>/payouts/', PayoutCreateView.as_view()),
    path('merchants/<uuid:merchant_id>/payouts/history/', PayoutHistoryView.as_view()),
]