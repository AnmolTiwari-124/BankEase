from django.db.models import Sum
from django.db.models import Q
from rest_framework import generics

from accounts.models import Account
from core.permissions import IsAdminRole
from core.responses import success
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer
from users.models import User
from .models import AuditLog
from .serializers import AdminAccountSerializer, AdminCustomerSerializer, AuditLogSerializer


class AdminDashboardView(generics.GenericAPIView):
    permission_classes = (IsAdminRole,)

    def get(self, request):
        data = {
            'total_customers': User.objects.filter(role=User.Role.CUSTOMER).count(),
            'active_customers': User.objects.filter(role=User.Role.CUSTOMER, is_active=True).count(),
            'total_accounts': Account.objects.count(),
            'total_transactions': Transaction.objects.count(),
            'total_transaction_volume': Transaction.objects.aggregate(total=Sum('amount'))['total'] or 0,
            'recent_transactions': TransactionSerializer(Transaction.objects.select_related('source_account', 'destination_account')[:10], many=True).data,
        }
        return success(data)


class AdminCustomerListView(generics.ListAPIView):
    permission_classes = (IsAdminRole,)
    serializer_class = AdminCustomerSerializer

    def get_queryset(self):
        qs = User.objects.filter(role=User.Role.CUSTOMER)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(email__icontains=search) | Q(full_name__icontains=search) | Q(phone__icontains=search))
        return qs


class AdminCustomerDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAdminRole,)
    serializer_class = AdminCustomerSerializer

    def get_queryset(self):
        return User.objects.filter(role=User.Role.CUSTOMER)

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        old_status = user.is_active
        response = super().update(request, *args, **kwargs)
        new_status = response.data.get('is_active', old_status)
        if old_status != new_status:
            AuditLog.objects.create(actor=request.user, action='UPDATE_CUSTOMER_STATUS', target_type='User', target_id=str(user.pk), detail=f'is_active={new_status}')
        return response


class AdminAccountListView(generics.ListAPIView):
    permission_classes = (IsAdminRole,)
    serializer_class = AdminAccountSerializer

    def get_queryset(self):
        qs = Account.objects.select_related('owner').all()
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(account_number__icontains=search) | Q(owner__email__icontains=search))
        return qs


class AdminAccountDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAdminRole,)
    serializer_class = AdminAccountSerializer

    def get_queryset(self):
        return Account.objects.select_related('owner').all()

    def update(self, request, *args, **kwargs):
        account = self.get_object()
        old_status = account.status
        response = super().update(request, *args, **kwargs)
        new_status = response.data.get('status', old_status)
        if old_status != new_status:
            AuditLog.objects.create(actor=request.user, action='UPDATE_ACCOUNT_STATUS', target_type='Account', target_id=str(account.pk), detail=f'status={new_status}')
        return response


class AdminTransactionListView(generics.ListAPIView):
    permission_classes = (IsAdminRole,)
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.select_related('source_account', 'destination_account').all()
        params = self.request.query_params
        if params.get('search'):
            qs = qs.filter(Q(reference__icontains=params['search']) | Q(source_account__account_number__icontains=params['search']) | Q(destination_account__account_number__icontains=params['search']))
        if params.get('status'):
            qs = qs.filter(status=params['status'].upper())
        return qs


class AdminTransactionDetailView(generics.RetrieveAPIView):
    permission_classes = (IsAdminRole,)
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.select_related('source_account', 'destination_account')


class AdminAuditListView(generics.ListAPIView):
    permission_classes = (IsAdminRole,)
    serializer_class = AuditLogSerializer
    queryset = AuditLog.objects.select_related('actor')
