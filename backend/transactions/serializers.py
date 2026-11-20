from django.db import transaction
from django.db.models import Q
from decimal import Decimal
from rest_framework import serializers

from accounts.models import Account
from notifications.models import Notification
from .models import Transaction


class TransferSerializer(serializers.Serializer):
    source_account_id = serializers.IntegerField()
    destination_account_number = serializers.CharField(max_length=20)
    amount = serializers.DecimalField(max_digits=14, decimal_places=2, min_value=Decimal('0.01'))
    description = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    idempotency_key = serializers.CharField(max_length=100, required=False, allow_blank=True)


class TransactionSerializer(serializers.ModelSerializer):
    sender_account = serializers.CharField(source='source_account.account_number', read_only=True)
    receiver_account = serializers.CharField(source='destination_account.account_number', read_only=True)

    class Meta:
        model = Transaction
        fields = ('id', 'reference', 'transaction_type', 'status', 'amount', 'sender_account', 'receiver_account', 'description', 'created_at')
