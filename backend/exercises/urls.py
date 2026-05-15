<<<<<<< HEAD
from django.urls import path
from .views import exercise_list_create, exercise_detail

urlpatterns = [
    path('', exercise_list_create),
    path('<int:pk>/', exercise_detail),
=======
from django.urls import path
from .views import exercise_list_create, exercise_detail

urlpatterns = [
    path('', exercise_list_create),
    path('<int:pk>/', exercise_detail),
>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
]