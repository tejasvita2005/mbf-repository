from django.urls import path
from .views import (
    start_camera,
    stop_camera,
    posture_metrics,
    posture_stream,
)

urlpatterns = [
    path("start/", start_camera, name="start_camera"),
    path("stop/", stop_camera, name="stop_camera"),
    path("metrics/", posture_metrics, name="posture_metrics"),
    path("stream/", posture_stream, name="posture_stream"),
]