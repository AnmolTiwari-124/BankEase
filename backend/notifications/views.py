from django.shortcuts import render
from rest_framework import generics, permissions

from core.responses import success
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=('is_read',))
        return success(NotificationSerializer(notification).data, 'Notification marked as read')


class NotificationReadAllView(generics.GenericAPIView):
    def post(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return success({'updated': count}, 'All notifications marked as read')

# Create your views here.
