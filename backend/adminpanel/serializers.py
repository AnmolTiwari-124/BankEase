from rest_framework import serializers

from accounts.models import Account
from users.models import User
from .models import AuditLog


class AdminCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone', 'role', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'email', 'full_name', 'phone', 'role', 'created_at', 'updated_at')


class AdminAccountSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Account
        fields = ('id', 'owner', 'owner_email', 'account_number', 'account_type', 'balance', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'owner_email', 'account_number', 'account_type', 'balance', 'created_at', 'updated_at')


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.EmailField(source='actor.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = ('id', 'actor_email', 'action', 'target_type', 'target_id', 'detail', 'created_at')
