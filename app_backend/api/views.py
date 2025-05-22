from django.shortcuts import render
from .models import Boulder, User, Board, Ascent, LedConfig, LikedBoulder
from .serializers import (
    BoulderSerializer, UserSerializer, UserRegistrationSerializer,
    BoardSerializer, LedConfigSerializer, AscentSerializer,
    AscentCreateSerializer, AscentWithBoulderSerializer, LikedBoulderSerializer
)
from rest_framework import generics, permissions, status
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
        board_id = self.kwargs.get('board_id')
        queryset = Boulder.objects.annotate(
            ascentionist_count=Count('ascents__user', distinct=True)
        ).select_related('setter', 'first_ascentionist', 'board')

        if board_id:
            queryset = queryset.filter(board_id=board_id)

        return queryset

    def perform_create(self, serializer):
        # Get board_id from URL
        board_id = self.kwargs.get('board_id')
        serializer.save(
            setter=self.request.user,
            board_id=board_id
        )

class BoulderDetail(generics.RetrieveUpdateAPIView):
    serializer_class = BoulderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Boulder.objects.all()

class BoulderAscentListCreate(generics.ListCreateAPIView): 
    serializer_class = AscentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AscentCreateSerializer
        return AscentSerializer
    
    def get_queryset(self):
        boulder_id = self.kwargs.get('boulder_id')
        return Ascent.objects.filter(boulder_id=boulder_id)
    
    def perform_create(self, serializer):
        boulder_id = self.kwargs.get('boulder_id')
        date_time = self.request.data.get('date_time')
        serializer.save(
            user=self.request.user,
            boulder_id=boulder_id,
            date_time=date_time
        )

class BoulderLikeView(generics.CreateAPIView, generics.DestroyAPIView):
    serializer_class = LikedBoulderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        boulder_id = self.kwargs.get('boulder_id')
        return LikedBoulder.objects.filter(
            boulder_id=boulder_id,
            user=self.request.user
        )
    
    def perform_create(self, serializer):
        boulder_id = self.kwargs.get('boulder_id')
        # Check if already liked to prevent duplicates
        if not LikedBoulder.objects.filter(
            boulder_id=boulder_id,
            user=self.request.user
        ).exists():
            serializer.save(
                user=self.request.user,
                boulder_id=boulder_id
            )
    
    def delete(self, request, *args, **kwargs):
        boulder_id = self.kwargs.get('boulder_id')
        like = LikedBoulder.objects.filter(
            boulder_id=boulder_id,
            user=self.request.user
        ).first()
        
        if like:
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


# ---- User Views ----
class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

class MyAscentList(generics.ListAPIView):
    serializer_class = AscentWithBoulderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ascent.objects.filter(user=self.request.user)
    
class UserAscentList(generics.ListAPIView):
    serializer_class = AscentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Ascent.objects.all()

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
        