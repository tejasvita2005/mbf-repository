from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import subprocess
import os
import sys
import json
from django.http import StreamingHttpResponse
from .camera import get_frame
import time
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
# Global process
camera_process = None

# Dummy metrics (will later come from AI)
current_metrics = {
    "reps": 0,
    "accuracy": 0,
    "feedback": "Waiting...",
    "stage": "DOWN"
}

live_metrics = {
    "reps": 0,
    "accuracy": 0,
    "feedback": "Waiting...",
    "stage": "DOWN",
    "valid_form": False
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


import os
import json

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def posture_metrics(request):

    BASE_DIR = os.path.dirname(
        os.path.dirname(
            os.path.dirname(__file__)
        )
    )

    metrics_file = os.path.join(
    BASE_DIR,
    "ai",
    "live_metrics.json"
)

    print("\n==============================")
    print("Metrics File:", metrics_file)
    print("Exists:", os.path.exists(metrics_file))
    print("==============================\n")

    if not os.path.exists(metrics_file):
        return Response({
            "status": "waiting",
            "message": "live_metrics.json not found",
            "path": metrics_file
        })

    try:
        with open(metrics_file, "r") as f:
            data = json.load(f)

        return Response(data)

    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        })
def generate_frames():

    while True:

        frame = get_frame()

        if frame is None:
            continue

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' +
            frame +
            b'\r\n'
        )

        time.sleep(0.03)
@authentication_classes([])
@permission_classes([AllowAny])
def posture_stream(request):

    return StreamingHttpResponse(
        generate_frames(),
        content_type="multipart/x-mixed-replace; boundary=frame"
    )
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_metrics(request):

    global live_metrics

    live_metrics["reps"] = request.data.get("reps", 0)
    live_metrics["accuracy"] = request.data.get("accuracy", 0)
    live_metrics["feedback"] = request.data.get("feedback", "")
    live_metrics["stage"] = request.data.get("stage", "")
    live_metrics["valid_form"] = request.data.get("valid_form", False)

    return Response({
        "status": "success",
        "message": "Metrics Updated"
    })