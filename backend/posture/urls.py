from django.urls import path
from .views import start_camera, stop_camera

urlpatterns = [
    path("start/", start_camera, name="start_camera"),
    path("stop/", stop_camera, name="stop_camera"),
]