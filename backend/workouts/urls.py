
from django.urls import path
from .views import workout_list_create, workout_detail, posture_results

urlpatterns = [
    path('', workout_list_create),
    path('<int:pk>/', workout_detail),
    path('posture-results/', posture_results),
]