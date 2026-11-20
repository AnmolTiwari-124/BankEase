from django.urls import path

from .views import (
    AdminAccountDetailView, AdminAccountListView, AdminAuditListView,
    AdminCustomerDetailView, AdminCustomerListView, AdminDashboardView,
    AdminTransactionDetailView, AdminTransactionListView,
)

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('customers/', AdminCustomerListView.as_view(), name='admin-customers'),
    path('customers/<int:pk>/', AdminCustomerDetailView.as_view(), name='admin-customer-detail'),
    path('accounts/', AdminAccountListView.as_view(), name='admin-account-list'),
    path('accounts/<int:pk>/', AdminAccountDetailView.as_view(), name='admin-account-detail'),
    path('transactions/', AdminTransactionListView.as_view(), name='admin-transactions'),
    path('transactions/<int:pk>/', AdminTransactionDetailView.as_view(), name='admin-transaction-detail'),
    path('audit-logs/', AdminAuditListView.as_view(), name='admin-audit-list'),
]
