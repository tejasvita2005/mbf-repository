from django.urls import path
from .views import feedback_list_create, feedback_detail

urlpatterns = [
    path('', feedback_list_create),
    path('<int:pk>/', feedback_detail),
]