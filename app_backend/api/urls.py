from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

# API endpoints
urlpatterns = format_suffix_patterns([
    path('boards/',
        views.BoardList.as_view(),
        name='board-list'
    ),
    path('boulders/',
        views.BoulderList.as_view(),
        name='boulder-list'),
    path('boulders/<int:pk>/',
        views.BoulderDetail.as_view(),
        name='boulder-detail'),
    path('users/',
        views.UserList.as_view(),
        name='user-list'),
    path('users/<int:pk>/',
        views.UserDetail.as_view(),
        name='user-detail'),
    path('registration/',
        views.UserRegistration.as_view(),
        name='user-registration'),
])
