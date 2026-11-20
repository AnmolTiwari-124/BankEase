import secrets

from django.db import models


class Transaction(models.Model):
    class Status(models.TextChoices):
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'

    class Type(models.TextChoices):
        TRANSFER = 'TRANSFER', 'Transfer'

    source_account = models.ForeignKey('accounts.Account', on_delete=models.PROTECT, related_name='sent_transactions', null=True)
    destination_account = models.ForeignKey('accounts.Account', on_delete=models.PROTECT, related_name='received_transactions', null=True)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=Type.choices, default=Type.TRANSFER)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    reference = models.CharField(max_length=32, unique=True, editable=False)
    idempotency_key = models.CharField(max_length=100, unique=True, null=True, blank=True)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)
        indexes = [models.Index(fields=('created_at',)), models.Index(fields=('status',))]

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = 'BE' + secrets.token_hex(10).upper()
        super().save(*args, **kwargs)
