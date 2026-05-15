<<<<<<< HEAD
from django.urls import path
from .views import feedback_list_create, feedback_detail

urlpatterns = [
    path('', feedback_list_create),
    path('<int:pk>/', feedback_detail),
=======
from django.urls import path
from .views import feedback_list_create, feedback_detail

urlpatterns = [
    path('', feedback_list_create),
    path('<int:pk>/', feedback_detail),
>>>>>>> bae68d7b901b6fef0c95bf2bddf48472023e5e96
]