from django.db import IntegrityError
from django.db.models import Q
from django.utils.dateparse import parse_datetime
from rest_framework import generics, permissions, status

from core.responses import success, failure
from core.permissions import IsAdminRole
from .models import Transaction
from .serializers import TransactionSerializer, TransferSerializer
from .services import TransferError, execute_transfer


class TransferView(generics.GenericAPIView):
    serializer_class = TransferSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            transfer = execute_transfer(user=request.user, **serializer.validated_data)
        except TransferError as exc:
            return failure(str(exc), status=400)
        except IntegrityError:
            return failure('Duplicate transfer request', status=409)
        return success(TransactionSerializer(transfer).data, 'Transfer successful', 201)


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            qs = Transaction.objects.select_related('source_account', 'destination_account').all()
        else:
            qs = Transaction.objects.select_related('source_account', 'destination_account').filter(
                Q(source_account__owner=user) | Q(destination_account__owner=user)
            )
        params = self.request.query_params
        if params.get('status'):
            qs = qs.filter(status=params['status'].upper())
        if params.get('reference'):
            qs = qs.filter(reference__icontains=params['reference'])
        if params.get('search'):
            qs = qs.filter(Q(reference__icontains=params['search']) |
                           Q(source_account__account_number__icontains=params['search']) |
                           Q(destination_account__account_number__icontains=params['search']))
        if params.get('from'):
            qs = qs.filter(created_at__gte=parse_datetime(params['from']) if parse_datetime(params['from']) else params['from'])
        if params.get('to'):
            qs = qs.filter(created_at__lte=parse_datetime(params['to']) if parse_datetime(params['to']) else params['to'])
        if params.get('category') and user.role != 'ADMIN':
            account_id = params.get('account_id')
            if params['category'].lower() == 'debit':
                qs = qs.filter(source_account__owner=user)
                if account_id:
                    qs = qs.filter(source_account_id=account_id)
            elif params['category'].lower() == 'credit':
                qs = qs.filter(destination_account__owner=user)
                if account_id:
                    qs = qs.filter(destination_account_id=account_id)
        return qs.distinct()


class TransactionDetailView(generics.RetrieveAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.select_related('source_account', 'destination_account')
        if self.request.user.role == 'ADMIN':
            return qs
        return qs.filter(Q(source_account__owner=self.request.user) | Q(destination_account__owner=self.request.user))
