from django.shortcuts import render
from rest_framework import generics

from .models import Beneficiary
from .serializers import BeneficiarySerializer


class BeneficiaryListCreateView(generics.ListCreateAPIView):
    serializer_class = BeneficiarySerializer

    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user).order_by('-created_at')


class BeneficiaryDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = BeneficiarySerializer

    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user)
