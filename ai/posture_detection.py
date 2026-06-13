import cv2
import mediapipe as mp
import pyttsx3
import threading

# Voice Engine
engine = pyttsx3.init()
last_feedback = "Good Form"

def speak(text):
    engine.say(text)
    engine.runAndWait()

# MediaPipe Setup
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mp_draw = mp.solutions.drawing_utils

# Webcam
cap = cv2.VideoCapture(0)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

counter = 0
stage = "DOWN"
feedback = "Ready"

while True:

    success, frame = cap.read()

    if not success:
        break

    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb)

    if results.pose_landmarks:

        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        landmarks = results.pose_landmarks.landmark

        left_shoulder = landmarks[
            mp_pose.PoseLandmark.LEFT_SHOULDER
        ]

        right_shoulder = landmarks[
            mp_pose.PoseLandmark.RIGHT_SHOULDER
        ]

        left_wrist = landmarks[
            mp_pose.PoseLandmark.LEFT_WRIST
        ]

        right_wrist = landmarks[
            mp_pose.PoseLandmark.RIGHT_WRIST
        ]

        # Average Heights
        wrist_height = (
            left_wrist.y + right_wrist.y
        ) / 2

        shoulder_height = (
            left_shoulder.y + right_shoulder.y
        ) / 2

        # Arm Balance Check
        arm_difference = abs(
            left_wrist.y - right_wrist.y
        )

        feedback = "Good Form"
        valid_form = True

        if arm_difference > 0.20:
            feedback = "Keep Both Arms Level"
            valid_form = False

        elif wrist_height > shoulder_height:
            feedback = "Raise Arms Higher"
            valid_form = False

        # Voice Feedback (non-blocking)
        if feedback != last_feedback:
            threading.Thread(
                target=speak,
                args=(feedback,),
                daemon=True
            ).start()

            last_feedback = feedback

        # Arms Raised
        if wrist_height < shoulder_height + 0.20:

            if stage == "DOWN":
                stage = "UP"

        # Arms Lowered
        elif wrist_height > shoulder_height + 0.30:

            if stage == "UP":

                counter += 1

                threading.Thread(
                    target=speak,
                    args=(f"Rep {counter}",),
                    daemon=True
                ).start()

                stage = "DOWN"

        # Bad Form Banner
        if not valid_form:

            cv2.rectangle(
                frame,
                (0, 0),
                (1280, 60),
                (0, 0, 255),
                -1
            )

            cv2.putText(
                frame,
                "BAD FORM - CORRECT POSITION",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                2
            )

        # Rep Counter
        cv2.putText(
            frame,
            f"Reps: {counter}",
            (20, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        # Feedback
        cv2.putText(
            frame,
            feedback,
            (20, 150),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2
        )

        # Stage
        cv2.putText(
            frame,
            f"Stage: {stage}",
            (20, 200),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255, 255, 255),
            2
        )

    cv2.imshow(
        "MB Fitness Shoulder Raise Detection",
        frame
    )

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()