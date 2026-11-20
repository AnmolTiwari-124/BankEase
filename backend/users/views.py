from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from core.responses import success, failure
from .serializers import LoginSerializer, PasswordChangeSerializer, RegisterSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return success({'user': UserProfileSerializer(user).data,
                        'access': str(refresh.access_token), 'refresh': str(refresh)}, 'Registration successful', 201)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return success(serializer.validated_data, 'Login successful')


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class PasswordChangeView(APIView):
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return failure('Password change failed', serializer.errors)
        serializer.save()
        return success(message='Password changed successfully')


class LogoutView(APIView):
    def post(self, request):
        refresh = request.data.get('refresh')
        if not refresh:
            return failure('Refresh token is required')
        try:
            RefreshToken(refresh).blacklist()
        except Exception:
            return failure('Invalid refresh token')
        return success(message='Logout successful')
