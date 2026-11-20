import secrets

from django.conf import settings
from django.db import models


class Account(models.Model):
    class AccountType(models.TextChoices):
        SAVINGS = 'SAVINGS', 'Savings'
        CURRENT = 'CURRENT', 'Current'

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        INACTIVE = 'INACTIVE', 'Inactive'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='accounts')
    account_number = models.CharField(max_length=20, unique=True, editable=False)
    account_type = models.CharField(max_length=10, choices=AccountType.choices, default=AccountType.SAVINGS)
    balance = models.DecimalField(max_digits=14, decimal_places=2, default='10000.00')
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def save(self, *args, **kwargs):
        if not self.account_number:
            while True:
                candidate = ''.join(str(secrets.randbelow(10)) for _ in range(12))
                if not Account.objects.filter(account_number=candidate).exists():
                    self.account_number = candidate
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.account_number} ({self.owner.email})'
