<<<<<<< HEAD
from django.urls import path
from .views import workout_list_create, workout_detail

urlpatterns = [
    path('', workout_list_create),
    path('<int:pk>/', workout_detail),
=======
from django.urls import path
from .views import workout_list_create, workout_detail

urlpatterns = [
    path('', workout_list_create),
    path('<int:pk>/', workout_detail),
>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
]