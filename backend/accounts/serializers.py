from rest_framework import serializers

from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Account
        fields = ('id', 'owner', 'owner_email', 'account_number', 'account_type', 'balance', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'account_number', 'balance', 'status', 'created_at', 'updated_at', 'owner')

    def validate_owner(self, value):
        request = self.context['request']
        if request.user.role != 'ADMIN' and value != request.user:
            raise serializers.ValidationError('You may only create your own account')
        return value

    def create(self, validated_data):
        request = self.context['request']
        if request.user.role != 'ADMIN':
            validated_data['owner'] = request.user
        return super().create(validated_data)
