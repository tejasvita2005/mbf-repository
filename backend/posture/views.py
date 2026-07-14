from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

camera_running = False

# Dummy metrics (will later come from AI)
current_metrics = {
    "reps": 0,
    "accuracy": 0,
    "feedback": "Waiting...",
    "stage": "DOWN"
}


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def posture_metrics(request):
    return Response(current_metrics)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def posture_stream(request):
    return Response({
        "status": "success",
        "message": "Live stream will be connected in integration phase."
    })