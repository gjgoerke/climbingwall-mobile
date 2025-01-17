from django.shortcuts import render
from .models import Boulder, User, Board, Ascent
from .serializers import BoulderSerializer
from rest_framework import generics, permissions, serializers, renderers
from django.db.models import Count


class BoulderList(generics.ListCreateAPIView):
    serializer_class = BoulderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Boulder.objects.annotate(
            ascentionist_count=Count('ascents__user', distinct=True)
        )

    def perform_create(self, serializer):
        serializer.save()

class BoulderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Boulder.objects.all()
    serializer_class = BoulderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()