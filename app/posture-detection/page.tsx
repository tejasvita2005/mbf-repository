'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Camera, ScanLine } from 'lucide-react';
import { usePostureDetection } from '@/hooks/usePostureDetection';

export default function PostureDetectionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
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
  } = usePostureDetection();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const liveStatusStyles: Record<'Ready' | 'Detecting' | 'Camera Off', string> = {
    Ready: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Detecting: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'Camera Off': 'bg-white/5 text-slate-400 border-white/10',
  };

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-[#050d1a] bg-grid-pattern">
      <Sidebar activeSection="posture-detection" />

      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center glow-cyan">
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Posture Detection</h1>
                <p className="text-slate-400 text-sm mt-1">Real-time shoulder raise analysis with live posture feedback</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl border border-white/7 p-6 animate-fade-in-up stagger-1">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-cyan-400" />
                    Live Webcam Feed
                  </h2>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${liveStatusStyles[liveStatus]}`}
                  >
                    {liveStatus}
                  </span>
                </div>

                <div className="relative w-full aspect-video rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  {isStreaming && streamUrl ? (
                    <img
                      src={streamUrl}
                      alt="Live webcam feed"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Camera className="w-12 h-12 text-slate-600" />
                      <p className="text-sm text-slate-500">Camera feed will appear here</p>
                      <p className="text-[10px] text-slate-600">Webcam integration coming soon</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    onClick={handleStartCamera}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:scale-[1.01]"
                  >
                    Start Camera
                  </button>
                  <button
                    onClick={handleStopCamera}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 text-slate-400 border border-white/5 hover:border-white/15 hover:text-white"
                  >
                    Stop Camera
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl border border-white/7 p-6 animate-fade-in-up stagger-2">
                <h2 className="text-lg font-semibold text-white mb-4">Posture Feedback</h2>
                <div className="p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 min-h-[120px] flex items-center">
                  <p className="text-base text-cyan-300 font-medium">{feedbackMessage}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in-up stagger-3">
              <div className="glass rounded-2xl border border-white/7 p-6">
                <h2 className="text-lg font-semibold text-white mb-5">Exercise Metrics</h2>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <p className="text-[10px] text-slate-500 mb-1">Rep Counter</p>
                    <p className="text-3xl font-bold text-gradient-cyan">{repCount}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <p className="text-[10px] text-slate-500 mb-1">Exercise Stage</p>
                    <p className="text-xl font-semibold text-white">{exerciseStage}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <p className="text-[10px] text-slate-500 mb-1">Form Status</p>
                    {formStatus ? (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium inline-block ${
                          formStatus === 'Good Form'
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                      <p className="text-[10px] text-slate-500 mb-1">Left Arm Angle</p>
                      <p className="text-xl font-bold text-white">{leftArmAngle}°</p>
                    </div>
                    <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                      <p className="text-[10px] text-slate-500 mb-1">Right Arm Angle</p>
                      <p className="text-xl font-bold text-white">{rightArmAngle}°</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
