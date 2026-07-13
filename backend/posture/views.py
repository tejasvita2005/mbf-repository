from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

camera_running = False


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_camera(request):
    global camera_running

    camera_running = True

    return Response({
        "status": "success",
        "camera": "started",
        "message": "Camera Started Successfully"
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def stop_camera(request):
    global camera_running

    camera_running = False

    return Response({
        "status": "success",
        "camera": "stopped",
        "message": "Camera Stopped Successfully"
    })