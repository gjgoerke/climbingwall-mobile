from django.shortcuts import render
from .models import Boulder, User, Board, Ascent, LedConfig
from .serializers import BoulderSerializer, UserSerializer, UserRegistrationSerializer, BoardSerializer, LedConfigSerializer
from rest_framework import generics, permissions, serializers, renderers, status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count


class LedConfigView(GenericAPIView, CreateModelMixin, RetrieveModelMixin):
    serializer_class = LedConfigSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        board_id = self.kwargs.get('board_id')
        return LedConfig.objects.get(board_id=board_id)
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class BoardCreate(generics.CreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response({
            'id': serializer.instance.id,
            **serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)
    
class BoardDetail(generics.RetrieveAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Board.objects.all()

class BoardList(generics.ListCreateAPIView):
    serializer_class = BoardSerializer

    def get_queryset(self):
        return Board.objects.all()

class BoulderList(generics.ListCreateAPIView):
    serializer_class = BoulderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Boulder.objects.annotate(
            ascentionist_count=Count('ascents__user', distinct=True)
        ).select_related('setter', 'first_ascentionist', 'board')

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