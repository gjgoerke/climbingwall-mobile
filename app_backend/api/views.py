from django.shortcuts import render
from .models import Boulder, User, Board, Ascent
from .serializers import BoulderSerializer, UserSerializer, UserRegistrationSerializer
from rest_framework import generics, permissions, serializers, renderers, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
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

class BoulderDetail(generics.RetrieveUpdateAPIView):
    serializer_class = BoulderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# ---- User Views ----
class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

class UserDetail(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserRegistration(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': serializer.data,
            'token': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)