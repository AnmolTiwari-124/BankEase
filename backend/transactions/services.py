from django.db import transaction

from accounts.models import Account
from notifications.models import Notification
from .models import Transaction


class TransferError(Exception):
    pass


@transaction.atomic
def execute_transfer(*, user, source_account_id, destination_account_number, amount, description='', idempotency_key=None):
    if idempotency_key:
        existing = Transaction.objects.filter(idempotency_key=idempotency_key).select_related('source_account', 'destination_account').first()
        if existing:
            if existing.source_account.owner_id != user.id:
                raise TransferError('Idempotency key belongs to another request')
            return existing

    try:
        source = Account.objects.select_for_update().get(pk=source_account_id)
    except Account.DoesNotExist:
        raise TransferError('Source account does not exist')

    if source.owner_id != user.id:
        raise TransferError('You do not own the source account')
    if source.status != Account.Status.ACTIVE:
        raise TransferError('Source account is inactive')

    try:
        destination = Account.objects.select_for_update().get(account_number=destination_account_number)
    except Account.DoesNotExist:
        raise TransferError('Destination account does not exist')

    if destination.pk == source.pk:
        raise TransferError('Cannot transfer to the same account')
    if destination.status != Account.Status.ACTIVE:
        raise TransferError('Destination account is inactive')

    if amount <= 0:
        raise TransferError('Amount must be greater than zero')
    if source.balance < amount:
        raise TransferError('Insufficient balance')

    source.balance -= amount
    destination.balance += amount
    Account.objects.filter(pk=source.pk).update(balance=source.balance)
    Account.objects.filter(pk=destination.pk).update(balance=destination.balance)

    transfer = Transaction.objects.create(
        source_account=source,
        destination_account=destination,
        amount=amount,
        description=description,
        idempotency_key=idempotency_key or None,
        status=Transaction.Status.COMPLETED,
    )

    Notification.objects.create(
        user=source.owner,
        title='Transfer completed',
        message=f'INR {amount:.2f} transferred to {destination.account_number}. Reference: {transfer.reference}',
    )
    Notification.objects.create(
        user=destination.owner,
        title='Money received',
        message=f'INR {amount:.2f} received from {source.account_number}. Reference: {transfer.reference}',
    )
    return transfer
