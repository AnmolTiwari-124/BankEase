from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Account
from adminpanel.models import AuditLog
from beneficiaries.models import Beneficiary
from notifications.models import Notification
from transactions.models import Transaction
from .models import User


class BankEaseAPITest(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(email='customer@bankease.test', password='StrongPass123!', full_name='Test Customer')
        self.other = User.objects.create_user(email='other@bankease.test', password='StrongPass123!', full_name='Other Customer')
        self.admin = User.objects.create_superuser(email='admin@bankease.test', password='StrongPass123!', full_name='Admin')
        self.source = Account.objects.create(owner=self.customer, account_type='SAVINGS', balance=Decimal('1000.00'))
        self.destination = Account.objects.create(owner=self.other, account_type='SAVINGS', balance=Decimal('100.00'))

    def auth(self, user):
        self.client.force_authenticate(user=user)

    def test_registration_login_refresh_profile_password_logout(self):
        response = self.client.post('/api/auth/register/', {'email': 'new@bankease.test', 'full_name': 'New User', 'password': 'StrongPass123!'})
        self.assertEqual(response.status_code, 201)
        refresh = response.data['data']['refresh']
        response = self.client.post('/api/auth/login/', {'email': 'new@bankease.test', 'password': 'StrongPass123!'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data['data'])
        response = self.client.post('/api/auth/refresh/', {'refresh': refresh})
        self.assertEqual(response.status_code, 200)
        refresh = response.data['refresh']
        self.auth(User.objects.get(email='new@bankease.test'))
        self.assertEqual(self.client.get('/api/auth/profile/').status_code, 200)
        self.assertEqual(self.client.post('/api/auth/password/change/', {'old_password': 'StrongPass123!', 'new_password': 'NewStrong456!'}).status_code, 200)
        self.assertEqual(self.client.post('/api/auth/logout/', {'refresh': refresh}).status_code, 200)

    def test_account_ownership_and_admin_access(self):
        self.auth(self.customer)
        response = self.client.get('/api/accounts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(self.client.get(f'/api/accounts/{self.destination.pk}/').status_code, 404)
        self.auth(self.admin)
        self.assertEqual(self.client.get('/api/accounts/').status_code, 200)

    def test_beneficiary_create_duplicate_and_delete(self):
        self.auth(self.customer)
        payload = {'name': 'Other Customer', 'account_number': self.destination.account_number}
        self.assertEqual(self.client.post('/api/beneficiaries/', payload).status_code, 201)
        duplicate = self.client.post('/api/beneficiaries/', payload)
        self.assertIn(duplicate.status_code, (400, 409))
        pk = Beneficiary.objects.get(user=self.customer).pk
        self.assertEqual(self.client.delete(f'/api/beneficiaries/{pk}/').status_code, 204)

    def test_successful_transfer_notifications_history_and_duplicate(self):
        self.auth(self.customer)
        payload = {'source_account_id': self.source.pk, 'destination_account_number': self.destination.account_number,
                   'amount': '125.50', 'idempotency_key': 'unique-request-1'}
        first = self.client.post('/api/transactions/transfer/', payload)
        self.assertEqual(first.status_code, 201)
        self.source.refresh_from_db(); self.destination.refresh_from_db()
        self.assertEqual(self.source.balance, Decimal('874.50'))
        self.assertEqual(self.destination.balance, Decimal('225.50'))
        second = self.client.post('/api/transactions/transfer/', payload)
        self.assertEqual(second.status_code, 201)
        self.assertEqual(Transaction.objects.count(), 1)
        self.assertEqual(Notification.objects.filter(user=self.customer).count(), 1)
        self.assertEqual(Notification.objects.filter(user=self.other).count(), 1)
        self.assertEqual(self.client.get('/api/transactions/').status_code, 200)
        self.assertEqual(self.client.get('/api/notifications/').status_code, 200)

    def test_invalid_transfers_and_authorization(self):
        self.auth(self.customer)
        bad = {'source_account_id': self.destination.pk, 'destination_account_number': self.source.account_number, 'amount': '10.00'}
        self.assertEqual(self.client.post('/api/transactions/transfer/', bad).status_code, 400)
        insufficient = {'source_account_id': self.source.pk, 'destination_account_number': self.destination.account_number, 'amount': '1001.00'}
        self.assertEqual(self.client.post('/api/transactions/transfer/', insufficient).status_code, 400)
        same = {'source_account_id': self.source.pk, 'destination_account_number': self.source.account_number, 'amount': '10.00'}
        self.assertEqual(self.client.post('/api/transactions/transfer/', same).status_code, 400)

    def test_admin_permissions_statistics_and_account_status(self):
        self.auth(self.customer)
        self.assertEqual(self.client.get('/api/admin/dashboard/').status_code, 403)
        self.auth(self.admin)
        dashboard = self.client.get('/api/admin/dashboard/')
        self.assertEqual(dashboard.status_code, 200)
        self.assertIn('total_customers', dashboard.data['data'])
        response = self.client.patch(f'/api/admin/accounts/{self.source.pk}/', {'status': 'INACTIVE'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(AuditLog.objects.filter(action='UPDATE_ACCOUNT_STATUS').exists())
