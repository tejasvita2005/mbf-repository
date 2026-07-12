'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const POSTURE_API_URL = 'http://127.0.0.1:8000';

export type LiveStatus = 'Ready' | 'Detecting' | 'Camera Off';
export type FormStatus = 'Good Form' | 'Incorrect Posture' | null;

type PostureMetrics = {
  exercise_id?: string | null;
  exercise_name?: string | null;
  rep_count: number;
  stage: string;
  feedback: string;
  left_arm_angle: number;
  right_arm_angle: number;
  form_status: FormStatus;
  running: boolean;
};

const DEFAULT_EXERCISE_ID = 'shoulder_raise';

function getIdleFeedback(exerciseId: string | null): string {
  if (!exerciseId) {
    return 'Select an exercise and start the camera.';
  }
  return 'Ready to begin AI Posture Analysis';
}

export function usePostureDetection() {
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('Camera Off');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedExercise] = useState<string>(DEFAULT_EXERCISE_ID);
  const [repCount, setRepCount] = useState(0);
  const [exerciseStage, setExerciseStage] = useState('DOWN');
  const [feedbackMessage, setFeedbackMessage] = useState(getIdleFeedback(DEFAULT_EXERCISE_ID));
  const [leftArmAngle, setLeftArmAngle] = useState(0);
  const [rightArmAngle, setRightArmAngle] = useState(0);
  const [formStatus, setFormStatus] = useState<FormStatus>(null);
  const [streamKey, setStreamKey] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const applyMetrics = useCallback((metrics: PostureMetrics) => {
    setRepCount(metrics.rep_count);
    setExerciseStage(metrics.stage);
    setFeedbackMessage(metrics.feedback);
    setLeftArmAngle(metrics.left_arm_angle);
    setRightArmAngle(metrics.right_arm_angle);
    setFormStatus(metrics.form_status);

    if (metrics.running) {
      setLiveStatus('Detecting');
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${POSTURE_API_URL}/api/posture/metrics`);
        if (!response.ok) {
          return;
        }
        const metrics: PostureMetrics = await response.json();
        applyMetrics(metrics);
        if (!metrics.running) {
          setIsStreaming(false);
          setLiveStatus('Camera Off');
          stopPolling();
        }
      } catch {
        setIsStreaming(false);
        setLiveStatus('Camera Off');
        stopPolling();
      }
    }, 100);
  }, [applyMetrics, stopPolling]);

  const handleStartCamera = useCallback(async () => {
    try {
      const response = await fetch(`${POSTURE_API_URL}/api/posture/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise: selectedExercise }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        setFeedbackMessage(error?.detail || 'Unable to start camera');
        setLiveStatus('Camera Off');
        return;
      }

      const data = await response.json();
      if (data.metrics) {
        applyMetrics(data.metrics);
      }

      setLiveStatus('Ready');
      setIsStreaming(true);
      setStreamKey(Date.now());
      startPolling();
    } catch {
      setFeedbackMessage('Unable to connect to posture detection service');
      setLiveStatus('Camera Off');
      setIsStreaming(false);
    }
  }, [applyMetrics, selectedExercise, startPolling]);

  const handleStopCamera = useCallback(async () => {
    stopPolling();
    setIsStreaming(false);

    try {
      await fetch(`${POSTURE_API_URL}/api/posture/stop`, { method: 'POST' });
    } catch {
      // Backend may already be stopped.
    }

    setLiveStatus('Camera Off');
    setRepCount(0);
    setExerciseStage('DOWN');
    setLeftArmAngle(0);
    setRightArmAngle(0);
    setFormStatus(null);
    setFeedbackMessage(getIdleFeedback(selectedExercise));
  }, [selectedExercise, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
      fetch(`${POSTURE_API_URL}/api/posture/stop`, { method: 'POST' }).catch(() => undefined);
    };
  }, [stopPolling]);

  const streamUrl = isStreaming
    ? `${POSTURE_API_URL}/api/posture/stream?ts=${streamKey}`
    : null;

  return {
    liveStatus,
    isStreaming,
    streamUrl,
    repCount,
    exerciseStage,
    feedbackMessage,
    leftArmAngle,
    rightArmAngle,
    formStatus,
    handleStartCamera,
    handleStopCamera,
  };
}
