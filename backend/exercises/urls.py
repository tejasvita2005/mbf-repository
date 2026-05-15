from django.urls import path
from .views import exercise_list_create, exercise_detail

urlpatterns = [
    path('', exercise_list_create),
    path('<int:pk>/', exercise_detail),
]