from django.urls import path
from .views import workout_list_create, workout_detail

urlpatterns = [
    path('', workout_list_create),
    path('<int:pk>/', workout_detail),
]