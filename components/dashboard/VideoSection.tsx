'use client';

import { useState } from 'react';
import { Play, Clock, X, ChevronRight, Film } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: string;
  thumbnail: string;
  description: string;
  videoId: string;
};

const videos: Video[] = [
  {
    id: 'v1',
    title: 'Full Body Morning Stretch',
    category: 'Stretching',
    duration: '12 min',
    difficulty: 'Beginner',
    thumbnail: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Start your morning with this gentle full-body stretching routine designed for rehabilitation.',
    videoId: 'L_xrDAtykMI',
  },
  {
    id: 'v2',
    title: 'Hip Mobility Flow',
    category: 'Mobility',
    duration: '18 min',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.pexels.com/photos/3822166/pexels-photo-3822166.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Improve hip joint range of motion with this targeted mobility flow sequence.',
    videoId: 'gX4FJ2_7hHw',
  },
  {
    id: 'v3',
    title: 'Core Rehabilitation Basics',
    category: 'Core Strength',
    duration: '22 min',
    difficulty: 'Beginner',
    thumbnail: 'https://images.pexels.com/photos/6454068/pexels-photo-6454068.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Build foundational core strength safely with exercises designed for injury recovery.',
    videoId: 'mh29S7JFrJA',
  },
  {
    id: 'v4',
    title: 'Balance & Proprioception',
    category: 'Balance',
    duration: '15 min',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Retrain balance and body awareness with progressive proprioception exercises.',
    videoId: 'rN6HeTJ0XE8',
  },
  {
    id: 'v5',
    title: 'Active Recovery Session',
    category: 'Recovery',
    duration: '20 min',
    difficulty: 'Beginner',
    thumbnail: 'https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Reduce soreness and accelerate healing with this gentle active recovery routine.',
    videoId: 'g_tea8ZNk5A',
  },
  {
    id: 'v6',
    title: 'Flexibility Deep Dive',
    category: 'Flexibility',
    duration: '25 min',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Systematic flexibility training targeting major muscle groups for improved movement.',
    videoId: 'qULTwqx0bYE',
  },
];

const categoryColors: Record<string, string> = {
  'Stretching': 'bg-blue-500/20 text-blue-400',
  'Mobility': 'bg-teal-500/20 text-teal-400',
  'Core Strength': 'bg-orange-500/20 text-orange-400',
  'Balance': 'bg-yellow-500/20 text-yellow-400',
  'Recovery': 'bg-emerald-500/20 text-emerald-400',
  'Flexibility': 'bg-pink-500/20 text-pink-400',
};

const difficultyColors: Record<string, string> = {
  'Beginner': 'text-emerald-400',
  'Intermediate': 'text-yellow-400',
  'Advanced': 'text-red-400',
};

export function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Stretching', 'Mobility', 'Core Strength', 'Balance', 'Recovery', 'Flexibility'];
  const filtered = filter === 'All' ? videos : videos.filter(v => v.category === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Film className="w-4.5 h-4.5 w-[18px] h-[18px] text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Exercise Videos</h2>
            <p className="text-xs text-slate-500">{videos.length} guided sessions available</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === cat
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/15 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((video, i) => (
          <div
            key={video.id}
            className={`glass rounded-2xl overflow-hidden border border-white/7 card-hover group cursor-pointer animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
            onClick={() => setSelectedVideo(video)}
          >
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all duration-300">
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </div>
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                <Clock className="w-3 h-3 text-slate-300" />
                <span className="text-xs text-slate-300">{video.duration}</span>
              </div>
              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm ${categoryColors[video.category]}`}>
                  {video.category}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{video.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{video.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-medium ${difficultyColors[video.difficulty]}`}>{video.difficulty}</span>
                <div className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-medium">
                  Watch now <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-scale-in">
          <div className="relative w-full max-w-4xl glass rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>

            {/* Video info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedVideo.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{selectedVideo.description}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[selectedVideo.category]}`}>
                    {selectedVideo.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock className="w-3 h-3" /> {selectedVideo.duration}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
