from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import subprocess
import os
import sys

# Global process
camera_process = None

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

    global camera_process

    if camera_process is None:

        BASE_DIR = os.path.dirname(
            os.path.dirname(
                os.path.dirname(__file__)
            )
        )

        ai_script = os.path.abspath(
            os.path.join(
                BASE_DIR,
                "..",
                "ai",
                "posture_detection.py"
            )
        )

        camera_process = subprocess.Popen(
            [sys.executable, ai_script]
        )

    return Response({
        "status": "success",
        "camera": "started",
        "message": "Camera Started Successfully"
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def stop_camera(request):

    global camera_process

    if camera_process is not None:

        camera_process.terminate()
        camera_process.wait()

        camera_process = None

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
        "message": "Live stream will be connected in next step."
    })