from django.db import IntegrityError
from rest_framework import serializers

from accounts.models import Account
from .models import Beneficiary


class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = ('id', 'name', 'account_number', 'bank_name', 'ifsc_code', 'relationship', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_account_number(self, value):
        if not Account.objects.filter(account_number=value).exists():
            raise serializers.ValidationError('No BankEase account exists with this account number')
        user = self.context['request'].user
        if Beneficiary.objects.filter(user=user, account_number=value).exists():
            raise serializers.ValidationError('This beneficiary already exists')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({'account_number': 'This beneficiary already exists'})
