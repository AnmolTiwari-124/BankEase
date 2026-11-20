from django.db.models import Q
from django.shortcuts import render
from rest_framework import generics, permissions

from core.permissions import IsAdminRole
from core.responses import failure
from .models import Account
from .serializers import AccountSerializer


class AccountListCreateView(generics.ListCreateAPIView):
    serializer_class = AccountSerializer

    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return Account.objects.select_related('owner').all()
        return Account.objects.filter(owner=self.request.user)


class AccountDetailView(generics.RetrieveAPIView):
    serializer_class = AccountSerializer

    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return Account.objects.select_related('owner').all()
        return Account.objects.filter(owner=self.request.user)


# Create your views here.
