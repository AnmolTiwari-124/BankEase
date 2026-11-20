from django.urls import path

from .views import TransactionDetailView, TransactionListView, TransferView

urlpatterns = [
    path('transfer/', TransferView.as_view(), name='transfer'),
    path('', TransactionListView.as_view(), name='transaction-list'),
    path('<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
]
