'use client';

import { useState } from 'react';
import { Camera, ScanLine } from 'lucide-react';

type LiveStatus = 'Ready' | 'Detecting' | 'Camera Off';
type FormStatus = 'GOOD FORM' | 'INCORRECT POSTURE' | null;

export function PostureDetectionCard() {
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('Ready');
  const [repCount] = useState(0);
  const [currentStage] = useState('DOWN');
  const [feedbackMessage, setFeedbackMessage] = useState('Ready');
  const [leftArmAngle] = useState(0);
  const [rightArmAngle] = useState(0);
  const [formStatus] = useState<FormStatus>(null);

  const handleStartCamera = () => {
    // TODO: Connect to ai/posture_detection.py backend — initialize webcam via OpenCV (cv2.VideoCapture)
    setLiveStatus('Ready');
    setFeedbackMessage('Camera started — awaiting detection');
  };

  const handleStopCamera = () => {
    // TODO: Connect to ai/posture_detection.py backend — release camera capture (cap.release())
    setLiveStatus('Camera Off');
    setFeedbackMessage('Camera stopped');
  };

  const handleLaunchAIDetection = () => {
    // TODO: Connect to ai/posture_detection.py backend — start MediaPipe Pose detection loop
    // TODO: Wire real-time updates for rep counter, stage, angles, form status, and voice feedback
    setLiveStatus('Detecting');
    setFeedbackMessage('AI detection launched');
  };

  const liveStatusStyles: Record<LiveStatus, string> = {
    Ready: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Detecting: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'Camera Off': 'bg-white/5 text-slate-400 border-white/10',
  };

  return (
    <div className="glass rounded-2xl border border-white/7 p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <ScanLine className="w-[18px] h-[18px] text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-white">AI Exercise Posture Detection</h2>
          <p className="text-xs text-slate-500">Real-time Shoulder Raise Analysis</p>
        </div>
        <span
          className={`shrink-0 text-[10px] px-2.5 py-1 rounded-full border font-medium ${liveStatusStyles[liveStatus]}`}
        >
          {liveStatus}
        </span>
      </div>

      <div className="relative w-full aspect-video rounded-xl bg-white/5 border border-white/10 overflow-hidden mb-5">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Camera className="w-10 h-10 text-slate-600" />
          <p className="text-xs text-slate-500">Webcam Preview</p>
          <p className="text-[10px] text-slate-600">Camera feed will appear here</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white/5 rounded-xl border border-white/5 p-3">
          <p className="text-[10px] text-slate-500 mb-1">Exercise</p>
          <p className="text-sm font-medium text-white">Shoulder Raise</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/5 p-3">
          <p className="text-[10px] text-slate-500 mb-1">Rep Counter</p>
          <p className="text-sm font-bold text-gradient-cyan">{repCount}</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/5 p-3">
          <p className="text-[10px] text-slate-500 mb-1">Current Stage</p>
          <p className="text-sm font-medium text-white">{currentStage}</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/5 p-3">
          <p className="text-[10px] text-slate-500 mb-1">Form Status</p>
          {formStatus ? (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-block ${
                formStatus === 'GOOD FORM'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}
            >
              {formStatus}
            </span>
          ) : (
            <p className="text-sm text-slate-500">—</p>
          )}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-5">
        <p className="text-[10px] text-slate-500 mb-1">Feedback Message</p>
        <p className="text-xs text-cyan-300 font-medium">{feedbackMessage}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/5 rounded-xl border border-white/5 p-3">
          <p className="text-[10px] text-slate-500 mb-1">Left Arm Angle</p>
          <p className="text-lg font-bold text-white">{leftArmAngle}°</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/5 p-3">
          <p className="text-[10px] text-slate-500 mb-1">Right Arm Angle</p>
          <p className="text-lg font-bold text-white">{rightArmAngle}°</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleStartCamera}
          className="px-4 py-2 rounded-xl text-xs font-medium transition-all bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:scale-[1.01]"
        >
          Start Camera
        </button>
        <button
          onClick={handleStopCamera}
          className="px-4 py-2 rounded-xl text-xs font-medium transition-all bg-white/5 text-slate-400 border border-white/5 hover:border-white/15 hover:text-white"
        >
          Stop Camera
        </button>
        <button
          onClick={handleLaunchAIDetection}
          className="px-4 py-2 rounded-xl text-xs font-medium transition-all bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:scale-[1.01]"
        >
          Launch AI Detection
        </button>
      </div>
    </div>
  );
}
