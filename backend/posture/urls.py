from django.urls import path
from . import views

urlpatterns = [
    path("start/", views.start_camera, name="start_camera"),
    path("stop/", views.stop_camera, name="stop_camera"),
    path("metrics/", views.posture_metrics, name="posture_metrics"),
    path("stream/", views.posture_stream, name="posture_stream"),
    path("update/", views.update_metrics, name="update_metrics"),
]