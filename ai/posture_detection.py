import cv2
import mediapipe as mp
import pyttsx3
import threading
import math
engine = pyttsx3.init()
engine.setProperty("rate", 165)
last_feedback = ""
def speak(text):
    engine.say(text)
    engine.runAndWait()
def speak_async(text):
    global last_feedback
    if text != last_feedback:
        threading.Thread(
            target=speak,
            args=(text,),
            daemon=True
        ).start()
        last_feedback = text
def calculate_angle(a, b, c):
    a = [a.x, a.y]
    b = [b.x, b.y]
    c = [c.x, c.y]
    radians = math.atan2(
        c[1]-b[1],
        c[0]-b[0]
    ) - math.atan2(
        a[1]-b[1],
        a[0]-b[0]
    )
    angle = abs(radians * 180 / math.pi)
    if angle > 180:
        angle = 360-angle
    return angle


# -----------------------------
# MediaPipe Pose
# -----------------------------
mp_pose = mp.solutions.pose

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=2,
    smooth_landmarks=True,
    min_detection_confidence=0.8,
    min_tracking_confidence=0.8
)

mp_draw = mp.solutions.drawing_utils


# -----------------------------
# Camera
# -----------------------------
cap = cv2.VideoCapture(0)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
cap.set(cv2.CAP_PROP_FPS, 30)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)


# -----------------------------
# Variables
# -----------------------------
counter = 0
stage = "DOWN"

feedback = "Ready"

valid_form = False

previous_stage = "DOWN"
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

        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]

        left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
        right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]

        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
        right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

        nose = landmarks[mp_pose.PoseLandmark.NOSE]

        # -----------------------------
        # Visibility Check
        # -----------------------------
        if (
            left_wrist.visibility < 0.70 or
            right_wrist.visibility < 0.70
        ):

            feedback = "Move Inside Camera"
            valid_form = False

        else:

            # Calculate Elbow Angles
            left_angle = calculate_angle(
                left_shoulder,
                left_elbow,
                left_wrist
            )

            right_angle = calculate_angle(
                right_shoulder,
                right_elbow,
                right_wrist
            )

            # Average Heights
            wrist_height = (
                left_wrist.y + right_wrist.y
            ) / 2

            shoulder_height = (
                left_shoulder.y + right_shoulder.y
            ) / 2

            # Arm Balance
            arm_difference = abs(
                left_wrist.y - right_wrist.y
            )

            # Body Lean
            shoulder_center = (
                left_shoulder.x + right_shoulder.x
            ) / 2

            body_offset = abs(
                nose.x - shoulder_center
            )

            feedback = "Good Form"
            valid_form = True

            # Check Straight Arms
            if left_angle < 140 or right_angle < 140:
                feedback = "Straighten Arms"
                valid_form = False

            # Check Arm Level
            elif arm_difference > 0.08:
                feedback = "Keep Arms Level"
                valid_form = False

            # Check Body Lean
            elif body_offset > 0.12:
                feedback = "Stand Straight"
                valid_form = False

            # Check Raise Height
            elif wrist_height > shoulder_height:
                feedback = "Raise Arms Higher"
                valid_form = False

            speak_async(feedback)
            # -----------------------------
            # Rep Counting
            # -----------------------------
            UP_THRESHOLD = shoulder_height - 0.05
            DOWN_THRESHOLD = shoulder_height + 0.20
            if valid_form:

                # Arms Up
                if wrist_height < UP_THRESHOLD:
                     stage = "UP"
                elif wrist_height > DOWN_THRESHOLD:

                    if stage == "UP":
                        counter += 1
                        speak_async(f"Rep {counter}")
                        stage = "DOWN"   

                # Arms Down
                elif wrist_height >= shoulder_height + 0.25:

                    if stage == "UP":

                        counter += 1

                        speak_async(f"Rep {counter}")

                        stage = "DOWN"

            else:

                stage = "DOWN"

            # -----------------------------
            # Banner
            # -----------------------------
            if valid_form:

                cv2.rectangle(frame, (0, 0), (1280, 60), (0, 180, 0), -1)

                cv2.putText(
                    frame,
                    "GOOD FORM",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (255, 255, 255),
                    2
                )

            else:

                cv2.rectangle(frame, (0, 0), (1280, 60), (0, 0, 255), -1)

                cv2.putText(
                    frame,
                    "INCORRECT POSTURE",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (255, 255, 255),
                    2
                )

            # -----------------------------
            # Display Information
            # -----------------------------
            cv2.putText(frame, f"Reps: {counter}", (20, 100),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

            cv2.putText(frame, feedback, (20,150),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)

            cv2.putText(frame, f"Stage: {stage}", (20,200),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)

            cv2.putText(frame, f"Left Angle: {int(left_angle)}", (20,250),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,0), 2)
            cv2.putText(frame, f"Right Angle: {int(right_angle)}", (20,290),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,0), 2)
    cv2.imshow(
        "MB Fitness Shoulder Raise Detection",
        frame
    )

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
