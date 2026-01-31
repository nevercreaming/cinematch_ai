
import React, { useState, useMemo } from 'react';
import { MediaItem, Person } from '../types';
import { X, Star, Calendar, Clock, User, Film, Play, ExternalLink, Clapperboard, Sparkles, Youtube, AlertCircle, Loader2, Info } from 'lucide-react';

interface DetailModalProps {
  item: MediaItem;
  onClose: () => void;
}

const PersonAvatar: React.FC<{ person: Person; size?: 'sm' | 'md' }> = ({ person, size = 'md' }) => {
  const [error, setError] = useState(false);
  const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  
  return (
    <div className={`${sizeClasses} rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center text-slate-500`}>
      {person.photoUrl && !error ? (
        <img 
          src={person.photoUrl} 
          alt={person.name} 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <User className={size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'} />
      )}
    </div>
  );
};

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  const [imgError, setImgError] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  
  const imageUrl = item.posterUrl;

  const embedUrl = useMemo(() => {
    if (!item.trailerUrl) return null;
    
    const url = item.trailerUrl.trim();
    let videoId = '';

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else if (url.includes('youtube.com/embed/')) {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    }

    if (!videoId) return null;

    const currentOrigin = window.location.origin;
    const encodedOrigin = currentOrigin && currentOrigin !== 'null' ? encodeURIComponent(currentOrigin) : '';
    
    let base = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&enablejsapi=1`;
    
    if (encodedOrigin) {
      base += `&origin=${encodedOrigin}&widget_referrer=${encodedOrigin}`;
    }

    return base;
  }, [item.trailerUrl]);

  const handleWatchTrailer = () => {
    if (!item.trailerUrl) {
      setTrailerError("The official trailer link for this title could not be retrieved from the cinematic archives. You may want to search manually on YouTube.");
      return;
    }

    if (embedUrl) {
      setVideoLoading(true);
      setShowTrailer(true);
      setTrailerError(null);
    } else {
      window.open(item.trailerUrl, '_blank', 'noopener,noreferrer');
      setTrailerError(null);
    }
  };

  const Placeholder = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 text-center relative overflow-hidden">
      <Clapperboard className="w-32 h-32 text-indigo-500 opacity-5 mb-8" />
      <div className="relative z-10 space-y-4">
        <h2 className="text-4xl font-black text-white/40 leading-none">
          {item.title}
        </h2>
        <div className="w-12 h-1 bg-indigo-500/30 mx-auto rounded-full" />
        <p className="text-xs uppercase tracking-[0.4em] font-black text-indigo-400/40">
          Official Media Loading
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all text-white shadow-xl hover:scale-110 active:scale-95"
          aria-label="Close details"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="md:w-1/3 relative bg-slate-950 min-h-[400px]">
          {showTrailer && embedUrl ? (
            <div className="w-full h-full bg-black relative">
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                </div>
              )}
              <iframe
                src={embedUrl}
                className="w-full h-full absolute inset-0"
                title={`${item.title} Official Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center gap-3 px-4">
                <button 
                  onClick={() => setShowTrailer(false)}
                  className="px-6 py-2 bg-slate-800/90 hover:bg-slate-700 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                >
                  Close Video
                </button>
              </div>
            </div>
          ) : (
            <>
              {!imgError && imageUrl ? (
                <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
              ) : (
                <Placeholder />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              
              {!imgError && imageUrl && item.posterSourceUrl && (
                <a 
                  href={item.posterSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 left-6 z-40 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] text-slate-300 font-bold uppercase tracking-widest border border-white/10 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                >
                  Source: {item.posterSource} <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                onClick={handleWatchTrailer}
                className="absolute inset-0 flex items-center justify-center group/play transition-all hover:bg-indigo-950/30"
              >
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform ring-4 ring-white/10">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </button>
            </>
          )}
        </div>

        <div className="md:w-2/3 p-8 md:p-14 overflow-y-auto custom-scrollbar space-y-10 relative">
          {trailerError && (
            <div className="absolute top-0 left-0 right-0 z-[60] bg-red-950/90 border-b border-red-500/50 backdrop-blur-xl p-6 animate-in slide-in-from-top duration-500">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-red-400 font-black text-xs uppercase tracking-[0.2em]">Trailer Unavailable</h4>
                  <p className="text-red-100/80 text-sm leading-relaxed font-medium">{trailerError}</p>
                </div>
                <button 
                  onClick={() => setTrailerError(null)}
                  className="p-1 hover:bg-red-500/20 rounded-full transition-colors text-red-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/20">
                {item.type}
              </span>
              {item.reviewScore && (
                <div className="flex items-center gap-1.5 text-yellow-500 font-black text-lg">
                  <Star className="w-5 h-5 fill-yellow-500" />
                  {item.reviewScore.toFixed(1)}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">{item.title}</h1>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-slate-400 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2.5 text-indigo-400"><Calendar className="w-4 h-4" /> {item.year}</div>
                <div className="flex items-center gap-2.5 text-indigo-400"><Clock className="w-4 h-4" /> {item.duration}</div>
                <div className="flex items-center gap-2.5 text-indigo-400"><Film className="w-4 h-4" /> {item.genres.join(", ")}</div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleWatchTrailer}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all text-white font-black text-sm uppercase tracking-widest shadow-xl group/btn"
              >
                <Youtube className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                Play Trailer
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 font-bold">The Narrative</h3>
              <p className="text-slate-200 text-xl leading-[1.6] font-light italic opacity-90">{item.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 font-bold">Director</h3>
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-800/30 border border-slate-700/30">
                  <PersonAvatar person={item.director} />
                  <span className="text-white font-bold">{item.director.name}</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 font-bold">Main Cast</h3>
                <div className="grid grid-cols-1 gap-3">
                  {item.cast && item.cast.map(person => (
                    <div key={person.name} className="flex items-center gap-4 p-2.5 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:bg-indigo-500/10 transition-colors group/person">
                      <PersonAvatar person={person} size="sm" />
                      <span className="text-slate-200 text-sm font-bold group-hover/person:text-indigo-300 transition-colors">
                        {person.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-8 rounded-[2rem] bg-indigo-500/[0.03] border border-indigo-500/10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-3 font-bold">
                <Sparkles className="w-4 h-4" /> CineMatch Insight
              </h3>
              <p className="text-slate-400 text-base italic leading-relaxed font-medium">
                {item.fullReason || "Selected based on thematic resonance and critical performance data."}
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-3 font-bold">
                <Play className="w-4 h-4 fill-indigo-400" /> Availability
              </h3>
              <div className="flex flex-wrap gap-4">
                {item.streamingPlatforms && item.streamingPlatforms.length > 0 ? (
                  item.streamingPlatforms.map(platform => (
                    <a 
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all text-white font-bold text-xs uppercase tracking-widest border border-slate-700/50 group"
                    >
                      {platform.name} <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-500 text-xs font-bold italic w-full">
                    <Info className="w-4 h-4" /> Check your local provider for streaming status.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
