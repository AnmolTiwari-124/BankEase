from django.conf import settings
from django.db import models


class Beneficiary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='beneficiaries')
    name = models.CharField(max_length=150)
    account_number = models.CharField(max_length=20)
    bank_name = models.CharField(max_length=150, default='BankEase')
    ifsc_code = models.CharField(max_length=20, blank=True)
    relationship = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=('user', 'account_number'), name='unique_beneficiary_account_per_user')]

    def __str__(self):
        return f'{self.name} - {self.account_number}'
